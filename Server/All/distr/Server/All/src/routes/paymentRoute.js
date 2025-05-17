"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
exports.paymentRoute = express_1.default.Router();
exports.paymentRoute.post('/', paymentController_1.createPayment);
exports.paymentRoute.get('/', paymentController_1.getPayments);
exports.paymentRoute.get('/:id', paymentController_1.getPaymentsByOrderId);
exports.paymentRoute.put('/:id', paymentController_1.updatePayment);
exports.paymentRoute.delete('/:id', paymentController_1.deletePayment);
