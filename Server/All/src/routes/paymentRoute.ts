import express from 'express'
import {
    createPayment,
    deletePayment,
    getPayments,
    getPaymentsByOrderId,
    updatePayment
} from '../controllers/paymentController'

export const paymentRoute = express.Router()

paymentRoute.post('/', createPayment)
paymentRoute.get('/', getPayments)
paymentRoute.get('/:id', getPaymentsByOrderId)
paymentRoute.put('/:id', updatePayment)
paymentRoute.delete('/:id', deletePayment)
