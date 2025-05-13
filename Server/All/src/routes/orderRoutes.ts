import express from 'express'
import {
    getOrderLists,
    getOrder,
    getOrderItemsByOrderId,
    updateOrderItem,
    deleteOrderItem,
    newOrder,
    getNewOrderNum,
    deleteOrder,
    updateOrder,
    getOrders,
    getOrderByClientId,
    newOrderItem,
    getOrderItems
} from '../controllers/orderController'

export const orderRoute = express.Router()


orderRoute.get('/getOrderNum/', getNewOrderNum)
orderRoute.get('/items/', getOrderItems)
orderRoute.get('/items/:id', getOrderItemsByOrderId)
orderRoute.post('/items/', newOrderItem)
orderRoute.put('/items/:id', updateOrderItem)
orderRoute.delete('/items/:id', deleteOrderItem)
orderRoute.get('/', getOrders)
orderRoute.get('/getOrderByClientId/:id', getOrderByClientId)
orderRoute.get('/orderLists/', getOrderLists)
orderRoute.get('/:id', getOrder)
orderRoute.post('/', newOrder)
orderRoute.delete('/:id', deleteOrder)
orderRoute.patch('/:id', updateOrder)