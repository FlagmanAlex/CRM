import { IClient } from './IClient'

interface ITgUser {
    user_id: string
    chat_id: string
    first_name: string
    last_name: string
    username: string
}
export interface IUser extends IClient, ITgUser {
    _id?: string
    description: string
    roles: string
    loginHistory: [{
        hash: string,
        date?: Date
    }]
}