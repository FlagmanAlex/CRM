import express from 'express'
import { 
    getOrderLists, 
    getOrder, 
    getOrderItems, 
    updateOrderItem, 
    deleteOrderItem, 
    newOrder,
    saveOrderItem,
    getNewOrderNum,
    deleteOrder,
    updateOrder,
    getOrders
} from '../controllers/orderController'

const router = express.Router()


router.get('/getOrderNum/', getNewOrderNum)

router.get('/items/:id', getOrderItems)
router.post('/items/', saveOrderItem)
router.put('/items/:id', updateOrderItem)
router.delete('/items/:id', deleteOrderItem)

router.get('/', getOrders)
router.get('/OrderLists/', getOrderLists)
router.get('/:id', getOrder)
router.post('/', newOrder)
router.delete('/:id', deleteOrder)
router.put('/:id', updateOrder)

// router.post('/:id', createOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)

export default router