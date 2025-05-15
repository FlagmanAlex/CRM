import { Types } from "mongoose"
/**
 * @interface интерфейс IOrder
 */
export interface IOrder {
    _id?: string
    orderNum: string
    orderDate: Date
    vendorCode: string
    orderType: 'Приход' | 'Расход'
    exchangeRate: number
    bonus: number
    warehouseId: Types.ObjectId
    supplierId: Types.ObjectId
    customerId: Types.ObjectId
    status: 'Активен' | 'В резерве' | 'Завершен' | 'Отменен'
    userId: Types.ObjectId                          //Создатель
}
