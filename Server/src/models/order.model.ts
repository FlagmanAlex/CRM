import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from '../../../Interfaces/IOrder';

interface IOrderModel extends Omit<IOrder, "_id">, Document {}

const OrderSchema: Schema = new Schema({
  orderNum: { type: Number, required: true },
  date: { type: Date, required: true, default: () => new Date() },
  clientId: { type: mongoose.Schema.ObjectId, ref: 'Client', required: true },
  percent: { type: Number, default: 15 }
});

export const Order = mongoose.model<IOrderModel>('Order', OrderSchema, 'Order');
