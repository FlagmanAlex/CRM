import mongoose, { Document, Schema } from 'mongoose';
import { IPayment } from '../../../Interfaces/IPayment'

interface IPaymentModel extends Omit<IPayment, "_id">, Document { }

const PaymentSchema: Schema = new Schema({

    date: { type: Date, required: true, default: () => new Date() },
    clientId: { type: mongoose.Schema.ObjectId, ref: 'Client', required: true },
    orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
    sum: { type: Number, required: true, default: 0 }
})

export const Payment = mongoose.model<IPaymentModel>('Payment', PaymentSchema, 'Payment')