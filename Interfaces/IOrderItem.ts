export interface IOrderItem {
    _id?: string
    orderId: string
    item: string
    url?: string
    courierNumber?: string
    dateTo: string
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
