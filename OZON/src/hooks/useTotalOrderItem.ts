import { IOrderItem } from "../../../Interfaces/IOrderItem"
import { IOrderList } from "../../../Interfaces/IOrderList"

export const useTotalOrderItem = (orderItems: IOrderItem[], orderList: IOrderList) => {
    const OrderItemsDiscountSum = () => {
        return orderItems.reduce((total, orderItem) => { return total + (orderItem.quantity * orderItem.discountPrice) }, 0)
    }
    const OrderItemsPriceSum = () => {
        return orderItems.reduce((total, orderItem) => { return total + (orderItem.quantity * orderItem.price) }, 0)
    }
    const DeliveryItemsSum = () => {
        const orderSum = OrderItemsPriceSum()
        if (orderSum < 1500) return 200
        else if (orderSum > 10000) return orderSum *  10 / 100
        else return (orderSum * orderList.percent / 100)
    }
    const AdditionalSum = () => {
        return orderItems.reduce((total, orderItem) => {
            return total + (orderItem.deliveryPost ? orderItem.deliveryPost : 0)
        }, 0)
    }

    const getDeliverySum = (orderSum: number) => {
        if (orderSum < 1500) return 200
        else return (orderSum * orderList.percent / 100)
    }

    return {
        DeliveryItemsSum,
        AdditionalSum,
        OrderItemsDiscountSum,
        OrderItemsPriceSum
    }
}
