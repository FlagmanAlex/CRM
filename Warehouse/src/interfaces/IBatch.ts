import { Document, Types } from "mongoose";

export interface IBatch {
    _id?: string
    productId: Types.ObjectId
    supplierId: Types.ObjectId
    receiptDate: Date
    purchasePrice: number
    expirationDate: Date
    quantityReceived: number
    unitOfMeasure: string
    status: string
}
