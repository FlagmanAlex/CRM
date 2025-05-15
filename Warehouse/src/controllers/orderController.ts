import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { OrderModel } from '../models/orderModel';
import { OrderDetailsModel } from '../models/orderDetailsModel';
import { InventoryModel } from '../models/inventoryModel';
import { TransactionModel } from '../models/transactionModel';
import { IOrderDetails } from '../interfaces/IOrderDetails';


export class OrderController {
    /**
     * Создание заказа
     * @param req body: IOrder, body.items: IOrderDetails[]
     * @returns order: IOrder, details: IOrderDetails
     */
    static async createOrder(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { orderType, customerId, supplierId, warehouseId } = req.body;
            const items: IOrderDetails[] = req.body.items;

            // Проверка наличия userId
            if (!req.userId) {
                throw new Error('Пользователь не авторизован');
            }

            // Валидация
            if (!['Приход', 'Расход'].includes(orderType)) {
                throw new Error('Некорректный тип заказа');
            }

            // Проверка наличия товаров (для расходных заказов)
            if (orderType === 'Расход') {
                for (const item of items) {
                    const inventory = await InventoryModel.findOne({
                        batchId: item.batchId,
                        warehouseId
                    }).session(session);

                    if (!inventory || inventory.quantityAvailable < item.quantity) {
                        throw new Error(`Недостаточно товара (ID партии: ${item.batchId})`);
                    }
                }
            }

            // Создание заказа
            const order = await OrderModel.create([{
                orderType,
                customerId: orderType === 'Приход' ? customerId : null,
                supplierId: orderType === 'Расход' ? supplierId : null,
                warehouseId,
                userId: req.userId,
                status: 'Активен'
            }], { session });

            // Добавление позиций
            const orderDetails = await OrderDetailsModel.insertMany(
                items.map((item: IOrderDetails) => {
                    const { orderId, ...rest } = item; // Исключаем orderId из item
                    return {
                        orderId: order[0]._id,
                        ...rest,
                    };
                }), { session }
            );

            // Обновление остатков и создание транзакций
            for (const item of items) {
                const quantityChange = orderType === 'Приход' ? item.quantity : -item.quantity;

                // Обновляем остатки
                const inventory = await InventoryModel.findOneAndUpdate(
                    { batchId: item.batchId, warehouseId },
                    { $inc: { quantityAvailable: quantityChange } },
                    { session, upsert: orderType === 'Приход', new: true }
                );

                if (!inventory) {
                    throw new Error(`Не удалось обновить остатки для партии ${item.batchId}`);
                }

                // Записываем транзакцию
                await TransactionModel.create([{
                    transactionType: orderType === 'Приход' ? 'Приход' : 'Расход',
                    productId: item.productId,
                    batchId: item.batchId,
                    warehouseId,
                    quantityChange,
                    previousQuantity: inventory.quantityAvailable - quantityChange,
                    userId: req.userId,
                    orderId: order[0]._id
                }], { session });
            }

            await session.commitTransaction();
            res.status(201).json({ order: order[0], details: orderDetails });
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ error: (error as Error).message });
        } finally {
            session.endSession();
        }
    }

    private static async getCurrentInventory(batchId: string, warehouseId: string) {
        const inventory = await InventoryModel.findOne({ batchId, warehouseId });
        return inventory?.quantityAvailable || 0;
    }
    /**
     * Получение заказа order & orderDetails по order._id
     */
    static async getOrderById(req: Request, res: Response) {
        try {
            const order = await OrderModel.findById(req.params.id)
                .populate('customerId supplierId warehouseId');

            if (!order) {
                res.status(404).json({ error: 'Заказ не найден' });
                return
            }

            const details = await OrderDetailsModel.find({ orderId: order._id })
                .populate('productId batchId');

            res.json({ order, details });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    static async updateOrderStatus(req: Request, res: Response) {
        const session = await mongoose.startSession();
        try {
            const { status } = req.body;
            const order = await OrderModel.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, session }
            );
            res.json(order);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        } finally {
            session.endSession();
        }
    }
}