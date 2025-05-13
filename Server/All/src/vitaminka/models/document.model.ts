import mongoose, { Schema } from "mongoose";
import { IDocument } from "../../../../Interfaces/IDocument";

interface IDoc extends Omit<IDocument, "_id">, Document { }

const documentSchema: Schema = new Schema({
    orderNum: { type: String, required: true },
    emexNum: { type: String },
    supplier: { type: String },
    status: { type: String },
    carrier: { type: String },
    carrierNum: { type: String },
    orderDate: { type: String },
    exchangeRate: { type: Number },
    bonus: { type: Number },
    paySum: { type: Number },
    logisticSum: { type: Number },
})

export const Document = mongoose.model<IDoc>("Document", documentSchema, 'Document');
