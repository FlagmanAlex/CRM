export interface IDocument {
    _id?: string
    orderNum: string
    emexNum: string
    supplier: string
    status: string
    carrier: string
    carrierNum: string
    orderDate: string
    exchangeRate: number
    bonus: number
    paySum: number
    logisticSum: number
}