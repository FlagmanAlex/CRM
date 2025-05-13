
export interface IPayment {
    _id?: string
    clientId: string
    clientName: string
    orderId: string
    orderNum: number
    date: string
    sum: number
}

export interface IPaymentClient {
    _id?: string | string
    clientId: {
        _id: string,
        name: string
    } | null
    orderId: {
        _id: string
        orderNum: number
    } | null
    date: string
    sum: number
}