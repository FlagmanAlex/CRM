import { find } from 'cheerio/dist/commonjs/api/traversing'
import { Order } from '../models/order.model'
import { OrderItems } from '../models/orderItems.model'
import { Response, Request } from 'express'
import { IOrder } from '../../../Interfaces/IOrder'

export const getOrderLists = async (req: Request, res: Response) => {
    try {


        const { startDate, endDate } = req.query

        // Создаем фильтр для диапазона дат
        const dateFilter: any = {};
        if (startDate) dateFilter.$gte = new Date(startDate as string)
        if (endDate) dateFilter.$lte = new Date(endDate as string)

        const orders = await Order.aggregate([

            // Фильтрация по диапазону дат
            ...(Object.keys(dateFilter).length > 0
                ? [{ $match: { date: dateFilter } }]
                : []),

            {
                $lookup: {
                    from: 'OrderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'items'
                },
            },
            {
                $addFields: {
                    discountSum: {
                        $sum: {
                            $map: {
                                input: '$items',
                                as: 'item',
                                in: { $multiply: ['$$item.quantity', '$$item.discountPrice'] }
                            }
                        }
                    },
                    priceSum: {
                        $sum: {
                            $map: {
                                input: '$items',
                                as: 'item',
                                in: { $multiply: ['$$item.quantity', '$$item.price'] }
                            }
                        }
                    },
                },
            },
            {
                $lookup: {
                    from: 'Client',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $addFields: {
                    clientName: { $arrayElemAt: ['$client.name', 0] },
                    percent: { $arrayElemAt: ['$client.percent', 0] }
                }
            },
            {
                $project: {
                    orderId: 1,
                    orderNum: 1,
                    date: 1,
                    discountSum: 1,
                    priceSum: 1,
                    clientId: 1,
                    clientName: 1,
                    percent: 1,
                }
            },
        ])

        res.status(200).json(orders)
    } catch (error) {
        console.error("Ошибка сервера в getOrders", (error as NodeJS.ErrnoException).message);
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

export const getOrder = async (req: Request, res: Response) => {
    try {

        const orderId = req.params.id

        if (orderId) {
            const order = await Order.findById(orderId)
            if (!order) res.status(404).json({ message: "Клиент не найден" })
                else res.status(200).json(order)
        } else console.log('orderId не определен');
        
        
    } catch (error) {
        console.error("Ошибка сервера в getOrder", (error as NodeJS.ErrnoException).message);
        res.status(500).json({ message: 'Ошибка сервера в getOrder' })
    }
}

export const newOrder = async (req: Request, res: Response) => {
    try {

        const newOrder = new Order(req.body)
        console.log(req.body);

        const saveOrder = await newOrder.save()
        res.status(201).json(saveOrder)
    } catch (error) {
        console.error('Ошибка создания документа Order', error)
        res.status(500).json({ message: 'Ошибка создания документа Order' })
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {

        const oldOrder: IOrder | null = await Order.findById(req.params.id)

        if (oldOrder) {
            const updateOrder: IOrder = {
                date: req.body.date || oldOrder.date,
                orderNum: req.body.orderNum || oldOrder.orderNum,
                percent: req.body.percent || oldOrder.percent,
                clientId: req.body.clientId || oldOrder.clientId
            }
            const response = await Order.findByIdAndUpdate(req.params.id, updateOrder, {
                new: true
            })

            if (!response) {
                res.status(404).json({ message: "Order документ не найден" })
                console.log("Order документ не найден");
            } else {

                res.status(200).json(response)
            }
        }


    } catch (error) {
        console.log('Ошибка обновления документа Order', error)
        res.status(500).json({ message: 'Ошибка обновления документа Order' })
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const respons = await OrderItems.find({ orderId: req.params.id })
        console.log(respons.length == 0);

        if (!respons.length) {
            const deleteOrder = await Order.findByIdAndDelete(req.params.id)
            if (!deleteOrder) {
                console.log("Order не найден");
                res.status(404).json({ message: "Order не найден" })
            } else {
                console.log("Order удален");
                res.status(204).json({ message: "Order удален" })
            }
        } else {
            console.log("Нелья удалять документ с содержимым внутри");
            res.status(403).json({ message: "Нелья удалять документ с содержимым внутри" })
        }
    } catch (error) {
        console.error('Ошибка удаления позиции deleteOrder', error);
        res.status(500).json({ message: 'Ошибка удаления позиции deleteOrder' })
    }
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find()
        if (!orders) res.status(404).json({ message: "Список документов пуст" })
        else res.status(200).json(orders)
    } catch (error) {
        console.error("Ошибка сервера в getOrder", (error as NodeJS.ErrnoException).message);
        res.status(500).json({ message: 'Ошибка сервера в getOrder' })
    }
}

export const getOrderItems = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id
        const orderItems = await OrderItems.find({ orderId })

        res.status(200).json(orderItems)

    } catch (error) {
        console.error("Ошибка сервера getOrderItem", (error as NodeJS.ErrnoException).message)
        res.status(500).json({ message: 'Ошибка сервера в getOrderItem' })
    }
}

export const updateOrderItem = async (req: Request, res: Response) => {
    try {
        const updateOrderItem =
            await OrderItems.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })

        if (!updateOrderItem) {
            res.status(404).json({ message: "Item элемент не найден" })
        } else {
            res.status(200).json(updateOrderItem)
        }
    } catch (error) {
        console.log('Ошибка обновления позиции updateOrderItem', error)
        res.status(500).json({ message: 'Ошибка обновления элемента item' })
    }
}

export const deleteOrderItem = async (req: Request, res: Response) => {
    try {
        const deleteOrderItem = await OrderItems.findByIdAndDelete(req.params.id)
        if (!deleteOrderItem) {
            res.status(404).json({ message: "OrderItem не найден" })
        } else {
            res.status(204).json({ message: "OrderItem удален" })
        }
    } catch (error) {
        console.error('Ошибка удаления позиции deleteOrderItem', error);
        res.status(500).json({ message: 'Ошибка удаления позиции deleteOrderItem' })
    }
}

export const newOrderItem = async (req: Request, res: Response) => {
    try {
        const newOrderItem = new OrderItems(req.body)
        console.log(req.body);

        const saveOrderItem = await newOrderItem.save()
        res.status(201).json(saveOrderItem)
    } catch (error) {
        console.error('Ошибка создания позиции createOrderItem', error);
        res.status(500).json({ message: 'Ошибка создания позиции createOrderItem' })
    }
}

export const getNewOrderNum = async (req: Request, res: Response) => {
    try {
        const maxNumOrder = await Order.findOne().sort({ orderNum: -1 }).limit(1).exec()
        if (maxNumOrder?.orderNum) res.status(201).json({ orderNum: maxNumOrder.orderNum + 1 })
        else res.status(404).json('Объект не найден')
    } catch (error) {
        console.error("Ошибка получения номера документа", error)
        res.status(501).json("Ошибка получения номера документа")
    }
}

export const getOrderByClientId = async (req: Request, res: Response) => {
    try {
        const respons = await Order.find({ clientId: req.params.id })
        res.status(200).json(respons)
    } catch (error) {
        console.log('Ошибка получения данных по ClientId');
        res.status(500).json({ message: 'Ошибка получения данных по ClientId' })
    }
}