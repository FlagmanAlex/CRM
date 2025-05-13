import mongoose, { Schema, Document, model } from 'mongoose';
import { IItem } from '../../../../../Interfaces/IItem'

interface Item extends Omit<IItem, "_id">, Document { }

const ItemSchema: Schema = new Schema(
    {
        documentId: { type: mongoose.Schema.ObjectId, ref: 'Document', required: true },
        groupId: { type: mongoose.Schema.ObjectId, ref: 'Group', required: true },
        article: { type: String },
        brandId: { type: mongoose.Schema.ObjectId, ref: 'Brand', required: true },
        name: { type: String },
        prevPrice: { type: Number },
        bonus: { type: Number },
        selsPrice: { type: Number },
        selsDate: { type: String },
        clientId: { type: mongoose.Schema.ObjectId, ref: 'Client' },

    }
);

export const ItemModel = model<Item>('Item', ItemSchema, 'Item');