import mongoose, { Document, Schema } from "mongoose";
import { IBatch } from "../interfaces/IBatch";

interface IBatchModel extends Omit<IBatch, '_id'>, Document { }

const batchSchema = new Schema<IBatchModel>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    receiptDate: { type: Date, required: true, default: Date.now },
    expirationDate: { type: Date, required: true },
    quantityReceived: { type: Number, required: true, min: 0 },
    purchasePrice: { type: Number, required: true, min: 0 }, // Добавлено: цена закупки
    unitOfMeasure: { type: String, required: true, enum: ['шт', 'кг', 'л', 'м'], default: 'шт' }, // Добавлено: единица измерения
    status: { // Добавлено: статус партии
        type: String,
        enum: ['active', 'expired', 'blocked', 'depleted'],
        default: 'active'
    }
});

batchSchema.index({ productId: 1 });
batchSchema.index({ supplierId: 1 });
batchSchema.index({ expirationDate: 1 });
batchSchema.index({ receiptDate: -1 });
batchSchema.index({ status: 1 }); // Для фильтрации по статусу

export const BatchModel = mongoose.model('Batch', batchSchema, 'Batch');