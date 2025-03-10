import { StyleSheet } from "react-native"
import { IOrderList } from "../../Interfaces/IOrderList"
import { IOrderItem } from "../../Interfaces/IOrderItem"

const color = {
    black: '#000',
    red: '#ad0000',
    green: '#007c00',
    blue: '#0000aa',
    grey: '#aaa',
    lightGrey: '#eee',
    lightBlue: '#ADD8E6',
    skyBlue: '#87CEEB',
    steelBlue: '#4682B4',
    yellow: '#ff0',
    amberYellow: '#ebb000',
    nightBlue: '#08004d',
    pinks: '#b200f8'

}


export const THEME = {
    color: {
        white: '#fff',
        grey: '#aaa',
        main: '#000066',
        black: color.black,
        wb: color.pinks,
        red: color.red
    },
    button: {
        apply: color.green,
        delete: color.red,
        cancel: color.amberYellow,
    }
}

export const STYLE = StyleSheet.create({
    textName: {
        maxWidth: '60%',

        fontSize: 20
    },
    textPhone: {
        fontSize: 20,
        color: color.nightBlue,
        fontWeight: '800'
    },
})

export const host = 'http://192.168.50.2'
export const port = '5001'
    // host: 'https://api.mirvitaminok.ru',
    // port: ''


/**
 * Возвращает сумму заказа, суммируя произведения всех позиций orderItems полей quantity * price. 
 * @param orderItems State OrderItems массив позиций
 * @returns Итоговая сумма произведений quantity * price
 */
export const getOrderItemsSumTotal = (orderItems: IOrderItem[]) => {
    return orderItems.reduce((total, orderItem) => {return total + (orderItem.quantity * orderItem.price)}, 0)
}
/**
 * Возвращает итоговый процент доставки по массиву orderItems
 * @param orderItems State OrderItems массив позиций
 * @param orderLists State OrderLists необходим для получения процента документа
 * @returns Процент доставки накладной 
 */
export const getDeliveryItemsSumTotal = (orderItems: IOrderItem[], orderList: IOrderList) => {
    return orderItems.reduce((total, orderItem) => {
        // Находим соответствующий orderList по orderId
        // const orderList = orderLists.find(orderList => orderList._id === orderItem.orderId);

        // Проверяем, что orderList существует и percent является числом
        if (orderList && typeof orderList.percent === 'number') {
            return Math.round(total + (orderItem.quantity * orderItem.price * orderList.percent / 100));
        }
        // Если не найден соответствующий orderList или percent некорректен, просто возвращаем текущую сумму
        return total;
    }, 0)
}
/**
 * Возвращает сумму всех доп платежей таких как курьерская доставка и прочее
 * @param orderItems State OrderItems массив позиций
 * @returns Сумма всех доп. платежей по позициям
 */
export const getAdditionalSum = (orderItems: IOrderItem[]) => {
    return orderItems.reduce((total, orderItem) => {
        return total + (orderItem.deliveryPost ? orderItem.deliveryPost : 0)
    }, 0)
}
/**
 * Возвращает сумму всех документов по полу priceSum из OrderLists
 * @param orderLists State OrderLists массив ордеров
 * @returns Итоговая сумма всех документов
 */
export const getOrderPriceSumTotal = (orderLists: IOrderList[]) => {
    return orderLists.reduce((total, orderList) => {return total + orderList.priceSum}, 0)
}
/**
 * Возвращает сумму доставки всех документов
 * @param orderLists State OrderLists массив ордеров
 * @returns Итоговая сумма доставки всех документов
 */
export const getOrderDeliverySumTotal = (orderLists: IOrderList[]) => {
    return Math.round(orderLists.reduce((total, orderList) => {return total + orderList.priceSum * (orderList.percent ? orderList.percent : 1) / 100}, 0))
}
