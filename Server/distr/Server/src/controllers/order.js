"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const order_model_1 = require("../models/order.model");
const getOrders = (req, res) => {
    try {
        const response = order_model_1.Order.find();
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Ошибка сервера в getOrders", error.message);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
exports.getOrders = getOrders;
