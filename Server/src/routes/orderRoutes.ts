import express from 'express'
import { getOrders, getOrder, getOrderItems, updateOrderItem } from '../controllers/orderController'

const router = express.Router()


router.get('/', getOrders)
router.get('/:id', getOrder)

router.get('/items/:id', getOrderItems)
router.put('/items/:id', updateOrderItem)

// router.post('/:id', createOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)

export default router