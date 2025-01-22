import express from 'express'
import { getOrders, getOrder, getOrderItems } from '../controllers/orderController'

const router = express.Router()


router.get('/', getOrders)
router.get('/:id', getOrder)
router.get('/items/:id', getOrderItems)

// router.post('/:id', createOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)

export default router