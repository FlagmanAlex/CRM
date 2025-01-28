import { populate } from 'dotenv'
import { Client } from '../models/client.model'
import { Order } from '../models/order.model'
import { OrderItems } from '../models/orderItems.model'
import { Response, Request } from 'express'
import path from 'path'

export const getOrders = async (req: Request, res: Response) => {
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
                                in: {$multiply: [ '$$item.quantity', '$$item.discountPrice']}
                            }
                        }
                    },
                    priceSum: {
                        $sum: {
                            $map: {
                                input: '$items',
                                as: 'item',
                                in: {$multiply: ['$$item.quantity', '$$item.price']}
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
                    percent: {$arrayElemAt: ['$client.percent', 0]}
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
        const order = await Order.findById(orderId)       

        if (!order) res.status(404).json({ message: "Клиент не найден" })
        else res.status(200).json(order)
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

        console.log(req.body);
        const updateOrderItem = 
            await OrderItems.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })
        
        if (!updateOrderItem) {
            res.status(404).json({message: "Item элемент не найден"})
        }
        res.status(200).json(updateOrderItem)
        console.log("UpdateOrderItem");
        
    } catch (error) {
        console.log('Ошибка обновления позиции item', error)
        res.status(500).json({message: 'Ошибка обновления элемента item'})
    }
}


// router.post('/', createClient)
// router.get('/:id', getClient)
// router.put('/:id', updateClient)
// router.delete('/:id', deleteClient)
