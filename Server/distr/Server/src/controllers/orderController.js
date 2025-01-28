"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderItem = exports.getOrderItems = exports.getOrder = exports.getOrders = void 0;
const order_model_1 = require("../models/order.model");
const orderItems_model_1 = require("../models/orderItems.model");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        // Создаем фильтр для диапазона дат
        const dateFilter = {};
        if (startDate)
            dateFilter.$gte = new Date(startDate);
        if (endDate)
            dateFilter.$lte = new Date(endDate);
        const orders = yield order_model_1.Order.aggregate([
            // Фильтрация по диапазону дат
            ...(Object.keys(dateFilter).length > 0
                ? [{ $match: { date: dateFilter } }]
                : []),
            {
                $lookup: {
                    from: 'OrderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'items'
                },
            },
            {
                $addFields: {
                    discountSum: {
                        $sum: {
                            $map: {
                                input: '$items',
                                as: 'item',
                                in: { $multiply: ['$$item.quantity', '$$item.discountPrice'] }
                            }
                        }
                    },
                    priceSum: {
                        $sum: {
                            $map: {
                                input: '$items',
                                as: 'item',
                                in: { $multiply: ['$$item.quantity', '$$item.price'] }
                            }
                        }
                    },
                },
            },
            {
                $lookup: {
                    from: 'Client',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $addFields: {
                    clientName: { $arrayElemAt: ['$client.name', 0] },
                    percent: { $arrayElemAt: ['$client.percent', 0] }
                }
            },
            {
                $project: {
                    orderId: 1,
                    orderNum: 1,
                    date: 1,
                    discountSum: 1,
                    priceSum: 1,
                    clientId: 1,
                    clientName: 1,
                    percent: 1,
                }
            },
        ]);
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Ошибка сервера в getOrders", error.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
exports.getOrders = getOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield order_model_1.Order.findById(orderId);
        if (!order)
            res.status(404).json({ message: "Клиент не найден" });
        else
            res.status(200).json(order);
    }
    catch (error) {
        console.error("Ошибка сервера в getOrder", error.message);
        res.status(500).json({ message: 'Ошибка сервера в getOrder' });
    }
});
exports.getOrder = getOrder;
const getOrderItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const orderItems = yield orderItems_model_1.OrderItems.find({ orderId });
        res.status(200).json(orderItems);
    }
    catch (error) {
        console.error("Ошибка сервера getOrderItem", error.message);
        res.status(500).json({ message: 'Ошибка сервера в getOrderItem' });
    }
});
exports.getOrderItems = getOrderItems;
const updateOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const updateOrderItem = yield orderItems_model_1.OrderItems.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updateOrderItem) {
            res.status(404).json({ message: "Item элемент не найден" });
        }
        res.status(200).json(updateOrderItem);
        console.log("UpdateOrderItem");
    }
    catch (error) {
        console.log('Ошибка обновления позиции item', error);
        res.status(500).json({ message: 'Ошибка обновления элемента item' });
    }
});
exports.updateOrderItem = updateOrderItem;
// router.post('/', createClient)
// router.get('/:id', getClient)
// router.put('/:id', updateClient)
// router.delete('/:id', deleteClient)
