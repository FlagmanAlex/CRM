import { Request, Response } from 'express';
import { TransactionModel } from '../models/transactionModel';
import mongoose from 'mongoose';
import { BatchModel } from '../models/batchModel';
import { InventoryModel } from '../models/inventoryModel';


// Создание транзакции (приход/расход)
export class TransactionController {
    static createTransaction = async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { transactionType, productId, warehouseId, batchId, quantityChange } = req.body;

            // Проверка наличия партии и склада
            const [batch, inventory] = await Promise.all([
                BatchModel.findById(batchId).session(session),
                InventoryModel.findOne({ batchId, warehouseId }).session(session)
            ]);

            if (!batch) throw new Error('Партия не найдена');
            if (transactionType === 'Расход' && (!inventory || inventory.quantityAvailable < quantityChange)) {
                throw new Error('Недостаточно товара на складе');
            }

            // Обновляем остатки
            const updatedInventory = await InventoryModel.findOneAndUpdate(
                { batchId, warehouseId },
                { $inc: { quantityAvailable: quantityChange } },
                { new: true, upsert: true, session }
            );

            // Создаем транзакцию
            const transaction = await TransactionModel.create([{
                transactionType,
                productId,
                warehouseId,
                batchId,
                previousQuantity: updatedInventory.quantityAvailable - quantityChange,
                quantityChange,
                userId: req.userId
            }], { session });

            await session.commitTransaction();
            res.status(201).json(transaction[0]);
        } catch (error) {
            await session.abortTransaction();
            res.status(400).json({ error: (error as Error).message });
        } finally {
            session.endSession();
        }
    };

    // История движений по товару
    static getTransactionsByProduct = async (req: Request, res: Response) => {
        try {
            const transactions = await TransactionModel.find({ productId: req.params.productId })
                .sort({ transactionDate: -1 })
                .populate('batchId')
                .populate('warehouseId');
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении транзакций' });
        }
    };
}
