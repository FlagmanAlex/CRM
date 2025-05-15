import { Request, Response } from 'express';
import { BatchModel } from '../models/batchModel';
import mongoose from 'mongoose';

// Создание новой партии
/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Управление партиями товаров
 */
export class BatchController {
    /**
     * @swagger
     * /api/batches:
     *   post:
     *     summary: Создать новую партию
     *     tags: [Batches]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Batch'
     *     responses:
     *       201:
     *         description: Партия создана
     *       400:
     *         description: Ошибка валидации
     */
    static createBatch = async (req: Request, res: Response) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { productId, supplierId, quantityReceived, purchasePrice, expirationDate } = req.body;

            if (!productId || !quantityReceived || !purchasePrice || !expirationDate) {
                res.status(400).json({ error: 'Не указаны обязательные поля' });
                return
            }

            const batch = await BatchModel.create([{
                productId,
                supplierId,
                quantityReceived,
                purchasePrice,
                expirationDate,
                status: 'active'
            }], { session });

            await session.commitTransaction();
            res.status(201).json(batch[0]);
        } catch (error) {
            await session.abortTransaction();
            res.status(500).json({ error: 'Ошибка при создании партии', details: (error as NodeJS.ErrnoException).message });
        } finally {
            session.endSession();
        }
    };

    // Получение партии по ID
    static getBatchById = async (req: Request, res: Response) => {
        try {
            const batch = await BatchModel.findById(req.params.id)
                .populate('productId')
                .populate('supplierId');

            if (!batch) {
                res.status(404).json({ error: 'Партия не найдена' });
                return
            }
            res.json(batch);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении партии' });
        }
    };

    // Получение всех партий для товара
    static getBatchesByProduct = async (req: Request, res: Response) => {
        try {
            const batches = await BatchModel.find({ productId: req.params.productId })
                .sort({ receiptDate: -1 });
            res.json(batches);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении партий' });
        }
    };

    // Обновление статуса партии (например, при просрочке)
    static updateBatchStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            const batch = await BatchModel.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );
            res.json(batch);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при обновлении статуса' });
        }
    };
}