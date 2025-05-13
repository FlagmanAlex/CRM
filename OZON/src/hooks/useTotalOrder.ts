import { IOrderItem } from "../../../Interfaces/IOrderItem"
import { IOrderList } from "../../../Interfaces/IOrderList"

export const useTotalOrder = (orderLists: IOrderList[]) => {

    const OrderPriceSum = () => {
        return orderLists.reduce((total, orderList) => {return total + orderList.priceSum}, 0)
    }
    const OrderDeliverySum = () => {
        return orderLists.reduce((total, orderList) => {
            const orderSum = orderList.priceSum
            if (orderSum < 1500) return total + 200
            else return total + (orderSum * orderList.percent / 100)
        }, 0)

    }
    
    return {
        OrderDeliverySum,
        OrderPriceSum,
    }
}