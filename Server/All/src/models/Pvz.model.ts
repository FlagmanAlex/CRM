import mongoose, { Schema, Document } from "mongoose"
import { IPVZ } from "../../../Interfaces/IPvz"

interface IPVZModel extends IPVZ, Document { }

const PVZSchema = new Schema({
    name: { type: String, required: true }
})

export const PVZ = mongoose.model<IPVZModel>('PVZ', PVZSchema, 'PVZ')