export interface IOrderItem {
    _id?: string
    orderId: string
    item: string
    url?: string
    courierNumber?: string
    dateTo: Date
    quantity: number
    discountPrice: number
    price: number
    deliveryPost: number
    payment: number
    pvzId: string
    ord: boolean
    pai: boolean
    rec: boolean
    ship: boolean
}
