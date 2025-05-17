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
exports.getOrderByClientId = exports.getNewOrderNum = exports.newOrderItem = exports.deleteOrderItem = exports.updateOrderItem = exports.getOrderItems = exports.getOrderItemsByOrderId = exports.getOrders = exports.deleteOrder = exports.updateOrder = exports.newOrder = exports.getOrder = exports.getOrderLists = void 0;
const order_model_1 = require("../models/order.model");
const orderItems_model_1 = require("../models/orderItems.model");
const getOrderLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getOrderLists = getOrderLists;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (orderId) {
            const order = yield order_model_1.Order.findById(orderId);
            if (!order)
                res.status(404).json({ message: "Клиент не найден" });
            else
                res.status(200).json(order);
        }
        else
            console.log('orderId не определен');
    }
    catch (error) {
        console.error("Ошибка сервера в getOrder", error.message);
        res.status(500).json({ message: 'Ошибка сервера в getOrder' });
    }
});
exports.getOrder = getOrder;
const newOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOrder = new order_model_1.Order(req.body);
        console.log(req.body);
        const saveOrder = yield newOrder.save();
        res.status(201).json(saveOrder);
    }
    catch (error) {
        console.error('Ошибка создания документа Order', error);
        res.status(500).json({ message: 'Ошибка создания документа Order' });
    }
});
exports.newOrder = newOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldOrder = yield order_model_1.Order.findById(req.params.id);
        if (oldOrder) {
            const updateOrder = {
                date: req.body.date,
                orderNum: req.body.orderNum,
                percent: req.body.percent,
                clientId: req.body.clientId
            };
            const response = yield order_model_1.Order.findByIdAndUpdate(req.params.id, { $set: updateOrder }, { new: true });
            console.log('response: ', response);
            if (!response) {
                res.status(404).json({ message: "Order документ не найден" });
                console.log("Order документ не найден");
            }
            else {
                res.status(200).json(response);
            }
        }
    }
    catch (error) {
        console.log('Ошибка обновления документа Order', error);
        res.status(500).json({ message: 'Ошибка обновления документа Order' });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const respons = yield orderItems_model_1.OrderItems.find({ orderId: req.params.id });
        console.log(respons.length == 0);
        if (!respons.length) {
            const deleteOrder = yield order_model_1.Order.findByIdAndDelete(req.params.id);
            if (!deleteOrder) {
                console.log("Order не найден");
                res.status(404).json({ message: "Order не найден" });
            }
            else {
                console.log("Order удален");
                res.status(204).json({ message: "Order удален" });
            }
        }
        else {
            console.log("Нелья удалять документ с содержимым внутри");
            res.status(403).json({ message: "Нелья удалять документ с содержимым внутри" });
        }
    }
    catch (error) {
        console.error('Ошибка удаления позиции deleteOrder', error);
        res.status(500).json({ message: 'Ошибка удаления позиции deleteOrder' });
    }
});
exports.deleteOrder = deleteOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.Order.find();
        if (!orders)
            res.status(404).json({ message: "Список документов пуст" });
        else
            res.status(200).json(orders);
    }
    catch (error) {
        console.error("Ошибка сервера в getOrder", error.message);
        res.status(500).json({ message: 'Ошибка сервера в getOrder' });
    }
});
exports.getOrders = getOrders;
const getOrderItemsByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getOrderItemsByOrderId = getOrderItemsByOrderId;
const getOrderItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderItems = yield orderItems_model_1.OrderItems.find();
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
        const updateOrderItem = yield orderItems_model_1.OrderItems.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updateOrderItem) {
            res.status(404).json({ message: "Item элемент не найден" });
        }
        else {
            res.status(200).json(updateOrderItem);
        }
    }
    catch (error) {
        console.log('Ошибка обновления позиции updateOrderItem', error);
        res.status(500).json({ message: 'Ошибка обновления элемента item' });
    }
});
exports.updateOrderItem = updateOrderItem;
const deleteOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteOrderItem = yield orderItems_model_1.OrderItems.findByIdAndDelete(req.params.id);
        if (!deleteOrderItem) {
            res.status(404).json({ message: "OrderItem не найден" });
        }
        else {
            res.status(204).json({ message: "OrderItem удален" });
        }
    }
    catch (error) {
        console.error('Ошибка удаления позиции deleteOrderItem', error);
        res.status(500).json({ message: 'Ошибка удаления позиции deleteOrderItem' });
    }
});
exports.deleteOrderItem = deleteOrderItem;
const newOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOrderItem = new orderItems_model_1.OrderItems(req.body);
        console.log(req.body);
        const saveOrderItem = yield newOrderItem.save();
        res.status(201).json(saveOrderItem);
    }
    catch (error) {
        console.error('Ошибка создания позиции createOrderItem', error);
        res.status(500).json({ message: 'Ошибка создания позиции createOrderItem' });
    }
});
exports.newOrderItem = newOrderItem;
const getNewOrderNum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maxNumOrder = yield order_model_1.Order.findOne().sort({ orderNum: -1 }).limit(1).exec();
        if (maxNumOrder === null || maxNumOrder === void 0 ? void 0 : maxNumOrder.orderNum)
            res.status(201).json({ orderNum: maxNumOrder.orderNum + 1 });
        else
            res.status(201).json({ orderNum: 1 });
    }
    catch (error) {
        console.error("Ошибка получения номера документа", error);
        res.status(501).json("Ошибка получения номера документа");
    }
});
exports.getNewOrderNum = getNewOrderNum;
const getOrderByClientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const respons = yield order_model_1.Order.find({ clientId: req.params.id });
        res.status(200).json(respons);
    }
    catch (error) {
        console.log('Ошибка получения данных по ClientId');
        res.status(500).json({ message: 'Ошибка получения данных по ClientId' });
    }
});
exports.getOrderByClientId = getOrderByClientId;
