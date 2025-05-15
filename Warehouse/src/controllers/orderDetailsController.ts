import { Request, Response } from 'express';
import mongoose, { ObjectId, Types } from 'mongoose';
import { IOrderDetailsModel, OrderDetailsModel } from '../models/orderDetailsModel';
import { InventoryModel } from '../models/inventoryModel';
import { TransactionModel } from '../models/transactionModel';
import { IOrderModel, OrderModel } from '../models/orderModel';
import { IOrderDetails } from '../interfaces/IOrderDetails';
import { IOrder } from '../interfaces/IOrder';

export class OrderDetailsController {
    //Добавить позицию
    static async addItem(req: Request, res: Response) {


        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Проверка наличия userId
            if (!req.userId) {
                throw new Error('Пользователь не авторизован');
            }

            const requestOrderDetails: IOrderDetails = req.body;

            // Проверка существования заказа
            const order: IOrderModel | null = await OrderModel.findById(requestOrderDetails.orderId).session(session);
            if (!order) throw new Error('Заказ не найден');

            // Для расходных заказов проверяем остатки
            if (order.orderType === 'Расход') {
                const inventory = await InventoryModel.findOne({
                    batchId: requestOrderDetails.batchId,
                    warehouseId: order.warehouseId
                }).session(session);

                if (!inventory || inventory.quantityAvailable < requestOrderDetails.quantity) {
                    throw new Error('Недостаточно товара на складе');
                }
            }

            // Добавляем позицию в таблицу заказов (orderDetails)
            const detail = await OrderDetailsModel.create([{
                orderId: requestOrderDetails.orderId,
                productId: requestOrderDetails.productId,
                batchId: requestOrderDetails.batchId,
                quantity: requestOrderDetails.quantity,
                unitPrice: requestOrderDetails.unitPrice
            }], { session });

            const previousQuantity = await this.getCurrentInventory(requestOrderDetails.batchId, order.warehouseId)
            // Обновляем остатки
            const quantityChange = order.orderType === 'Приход' ?
                requestOrderDetails.quantity :
                -requestOrderDetails.quantity
            await InventoryModel.updateOne(
                { batchId: requestOrderDetails.batchId, warehouseId: order.warehouseId },
                { $inc: { quantityAvailable: quantityChange } },
                { session, upsert: true }
            );

            // Логируем транзакцию
            await TransactionModel.create([{
                transactionType: order.orderType === 'Приход' ? 'Приход' : 'Расход',
                productId: requestOrderDetails.productId,
                batchId: requestOrderDetails.batchId,
                warehouseId: order.warehouseId,
                quantityChange,
                previousQuantity,
                userId: req.userId,
                orderId: requestOrderDetails.orderId
            }], { session });

            await session.commitTransaction();
            res.status(201).json(detail[0]);
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ error: (error as Error).message });
        } finally {
            session.endSession();
        }
    }
    static async removeItem(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {

            // Проверка наличия userId
            if (!req.userId) {
                throw new Error('Пользователь не авторизован');
            }

            const orderDetailsId = req.params.id
            const detail: IOrderDetailsModel | null = await OrderDetailsModel.findById(orderDetailsId).session(session);
            if (!detail) throw new Error('Позиция не найдена');
            const order: IOrderModel | null = await OrderModel.findById(detail.orderId).session(session)
            if (!order) throw new Error('Заказ не найден');

            if (order.status !== 'Завершен') {
                const quantityChange = order.orderType === 'Приход'
                    ? -detail.quantity
                    : detail.quantity

                const previousQuantity = OrderDetailsController.getCurrentInventory(detail.batchId, order.warehouseId)

                await InventoryModel.updateOne(
                    { batchId: detail.batchId, warehouseId: order.warehouseId },
                    { $inc: { quantityAvailable: quantityChange } },
                    { session }
                );

                await TransactionModel.create([
                    {
                        transactionType: 'Корректировка',
                        productId: detail.productId,
                        batchId: detail.batchId,
                        warehouseId: order.warehouseId,
                        quantityChange: -quantityChange,
                        previousQuantity,
                        userId: req.userId,
                        orderId: detail.orderId._id,
                        comment: 'Отмена позиции заказа',
                    },
                ], { session });
            }

            await OrderDetailsModel.deleteOne({ _id: req.params.id }).session(session);
            await session.commitTransaction();
            res.json({ success: true });
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ error: (error as Error).message });
        } finally {
            session.endSession();
        }
    }

    private static async getCurrentInventory(batchId: Types.ObjectId, warehouseId: Types.ObjectId): Promise<number> {
        const inventory = await InventoryModel.findOne({ batchId, warehouseId });
        return inventory?.quantityAvailable || 0;
    }
}