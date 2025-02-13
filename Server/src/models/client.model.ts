import mongoose, { Schema, Document } from 'mongoose'
import { IClient } from '../../../Interfaces/IClient'

interface IClientModel extends Omit<IClient, "_id">, Document {}

const ClientSchema: Schema = new Schema ({
    name: { type: String, required: true },
    gender: {type: String},
    phone: {type: String},
    address: {type: String},
    GPS: {type: String},
    Percent: {type: Number, default: 15}
})

export const Client = mongoose.model<IClientModel>('Client', ClientSchema, 'Client')