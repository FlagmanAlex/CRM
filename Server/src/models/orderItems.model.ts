import mongoose, { Schema, Document } from "mongoose"
import { IOrderItems } from '../../../Interfaces/IOrderItems'

interface IOrderItemsModel extends Omit<IOrderItems, "_id">, Document {}

const OrderItemsSchema: Schema = new Schema({
    orderId: { type: mongoose.Schema.ObjectId, ref: 'Order', required: true }, 
    pvzId: { type: mongoose.Schema.ObjectId, ref: 'PVZ', required: true },
    courierNumber: { type: Number, required: true },
    name: { type: String, required: true },
    url: {type: String, required: false},
    dateTo: { type: Date, required: true },
    quantity: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    price: { type: Number, required: true },
    deliverySum: { type: Number, required: true },
    payment: { type: Number, required: true },
    ord: { type: Boolean, required: true, default: false },
    pai: { type: Boolean, required: true, default: false  },
    rec: { type: Boolean, required: true, default: false  },
    ship: { type: Boolean, required: true, default: false  }
  })

export const OrderItems =  mongoose.model<IOrderItemsModel>('OrderItems', OrderItemsSchema, 'OrderItems')