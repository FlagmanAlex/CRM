import express from 'express'
import { 
    getOrderLists, 
    getOrder, 
    getOrderItems, 
    updateOrderItem, 
    deleteOrderItem, 
    newOrder,
    getNewOrderNum,
    deleteOrder,
    updateOrder,
    getOrders,
    getOrderByClientId,
    newOrderItem
} from '../controllers/orderController'

const router = express.Router()


router.get('/getOrderNum/', getNewOrderNum)

router.get('/items/:id', getOrderItems)
router.post('/items/', newOrderItem)
router.put('/items/:id', updateOrderItem)
router.delete('/items/:id', deleteOrderItem)

router.get('/', getOrders)
router.get('/getOrderByClientId/:id', getOrderByClientId)
router.get('/orderLists/', getOrderLists)
router.get('/:id', getOrder)
router.post('/', newOrder)
router.delete('/:id', deleteOrder)
router.patch('/:id', updateOrder)

// router.post('/:id', createOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)

export default router