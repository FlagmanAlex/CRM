import mongoose from 'mongoose'
import { IUser } from '../../../Interfaces/IUser'

interface IUserModel extends Omit<IUser, "_id">, mongoose.Document {}

const loginSchema = new mongoose.Schema({
    hash: {type: String, require: true},
    date: {type: Date, default: Date.now},
})

const UserSchema = new mongoose.Schema({
    user_id: {type: String},
    chat_id: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String},
    phone: {type: String},
    address: {type: String},
    gps: {type: String},
    percent: {type: Number, default: 15},
    description: {type: String},
    roles: {type: String, default: 'USER'},
    loginHistory: [loginSchema]
})

export const User = mongoose.model<IUserModel>('User', UserSchema, 'User')

