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
exports.deletePayment = exports.updatePayment = exports.getPaymentsByOrderId = exports.getPayments = exports.createPayment = void 0;
const payment_model_1 = require("../models/payment.model");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPayment = new payment_model_1.Payment(req.body);
        const savePayment = newPayment.save();
        if (savePayment) {
            res.status(201).json(savePayment);
        }
    }
    catch (error) {
        console.error('Ошибка создания документа Payment', error);
        res.status(500).json({ message: 'Ошибка создания документа Payment' });
    }
});
exports.createPayment = createPayment;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_model_1.Payment.find()
            .populate('clientId', 'name')
            .populate('orderId', 'orderNum')
            .lean(); // Преобразуем в обычные объекты
        console.log(payments);
        const formattedPayments = payments.map(payment => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                _id: ((_a = payment._id) === null || _a === void 0 ? void 0 : _a.toString()) || '', // Преобразуем ObjectId в строку
                date: payment.date.toString(), // Преобразуем дату в строку ISO
                orderId: ((_c = (_b = payment.orderId) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString()) || '',
                orderNum: ((_d = payment.orderId) === null || _d === void 0 ? void 0 : _d.orderNum) || 0,
                sum: payment.sum,
                clientId: ((_f = (_e = payment.clientId) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString()) || '', // Проверяем clientId на null
                clientName: ((_g = payment.clientId) === null || _g === void 0 ? void 0 : _g.name) || 'Unknown', // Добавляем значение по умолчанию
            });
        });
        // Проверяем, есть ли платежи
        if (formattedPayments.length > 0) {
            res.status(200).json(formattedPayments);
        }
        else {
            res.status(404).json({ message: 'Нет оплат' });
        }
    }
    catch (error) {
        console.error('Ошибка сервера', error);
        res.status(404).json({ message: 'Ошибка сервера' });
    }
});
exports.getPayments = getPayments;
const getPaymentsByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    try {
        const payments = yield payment_model_1.Payment.find({ orderId });
        res.status(200).json(payments);
    }
    catch (error) {
        console.error('Ошибка сервера', error);
        res.status(404).json({ message: 'Ошибка сервера' });
    }
});
exports.getPaymentsByOrderId = getPaymentsByOrderId;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatePayment = yield payment_model_1.Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updatePayment) {
            res.status(404).json({ message: "payment элемент не найден" });
        }
        else {
            res.status(200).json(updatePayment);
        }
    }
    catch (error) {
        console.log('Ошибка обновления документа payment', error);
        res.status(500).json({ message: 'Ошибка обновления документа payment' });
    }
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletePayment = yield payment_model_1.Payment.findByIdAndDelete(req.params.id);
        if (!deletePayment) {
            res.status(404).json({ message: "Payment не найден" });
        }
        else {
            res.status(204).json({ message: "Payment удален" });
        }
    }
    catch (error) {
        console.error('Ошибка удаления документа deletePaytment', error);
        res.status(500).json({ message: 'Ошибка удаления документа deletePaytment' });
    }
});
exports.deletePayment = deletePayment;
