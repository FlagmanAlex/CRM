"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.get('/getOrderNum/', orderController_1.getNewOrderNum);
router.get('/items/:id', orderController_1.getOrderItems);
router.post('/items/', orderController_1.saveOrderItem);
router.put('/items/:id', orderController_1.updateOrderItem);
router.delete('/items/:id', orderController_1.deleteOrderItem);
router.get('/', orderController_1.getOrders);
router.get('/OrderLists/', orderController_1.getOrderLists);
router.get('/:id', orderController_1.getOrder);
router.post('/', orderController_1.newOrder);
router.delete('/:id', orderController_1.deleteOrder);
router.put('/:id', orderController_1.updateOrder);
// router.post('/:id', createOrder)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)
exports.default = router;
