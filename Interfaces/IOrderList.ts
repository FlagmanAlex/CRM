export interface IOrderList {
    _id: string
    orderNum: number
    date: Date
    clientId: string
    discountSum: number
    priceSum: number
    clientName: string
    percent: number
}
