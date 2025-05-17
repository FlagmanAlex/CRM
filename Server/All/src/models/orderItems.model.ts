import mongoose, { Schema, Document } from "mongoose"
import { IOrderItem } from '../../../../Interfaces/IOrderItem'

interface IOrderItemsModel extends Omit<IOrderItem, "_id">, Document { }

const OrderItemsSchema: Schema = new Schema({
  orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true },
  pvzId: { type: mongoose.Schema.ObjectId, ref: 'PVZ', required: true },
  courierNumber: { type: Number, required: false },
  item: { type: String, required: true },
  url: { type: String, required: false },
  dateTo: { type: Date, required: true },
  quantity: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  price: { type: Number, required: true },
  deliverySum: { type: Number, required: false },
  payment: { type: Number, required: false },
  ord: { type: Boolean, required: true, default: false },
  pai: { type: Boolean, required: true, default: false },
  rec: { type: Boolean, required: true, default: false },
  ship: { type: Boolean, required: true, default: false }
})

export const OrderItems = mongoose.model<IOrderItemsModel>('OrderItems', OrderItemsSchema, 'OrderItems')