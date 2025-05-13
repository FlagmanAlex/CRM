import { Types } from "mongoose"

export interface IItem {
    _id?: string
    documentId: Types.ObjectId
    groupId: Types.ObjectId | null
    article: string
    brandId: Types.ObjectId | null
    name: string
    prevPrice: number
    bonus: number
    selsPrice: number
    selsDate: string
    clientId: Types.ObjectId | null
}