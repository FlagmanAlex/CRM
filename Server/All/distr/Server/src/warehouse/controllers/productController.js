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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.archiveProduct = exports.getActive = void 0;
const product_model_1 = require("../models/product.model");
const batch_model_1 = require("../models/batch.model");
const inventory_model_1 = require("../models/inventory.model");
const orderDetail_model_1 = require("../models/orderDetail.model");
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = require("../models/transaction.model");
const getActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.ProductModel.find({ isArchived: false })
            .populate('category')
            .populate('supplier');
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.getActive = getActive;
const archiveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        // Проверяем использование товара
        const batches = yield batch_model_1.BatchModel.find({ product: productId });
        if (batches.length > 0) {
            res.status(400).json({ message: 'Product is used in batches and cannot be archived' });
        }
        const inventory = yield inventory_model_1.InventoryModel.find({ product: productId });
        if (inventory.length > 0) {
            res.status(400).json({ message: 'Product is used in inventory and cannot be archived' });
        }
        const orders = yield orderDetail_model_1.OrderDetailModel.find({ product: productId });
        if (orders.length > 0) {
            res.status(400).json({ message: 'Product is used in orders and cannot be archived' });
        }
        // Архивируем товар
        const updatedProduct = yield product_model_1.ProductModel.findByIdAndUpdate(productId, { isArchived: true }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product archived successfully' });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.archiveProduct = archiveProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const productId = req.params.productId;
        // Проверяем использование товара
        const batches = yield batch_model_1.BatchModel.find({ product: productId }).session(session);
        if (batches.length > 0) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({ error: 'Product is used in batches and cannot be deleted' });
        }
        const inventory = yield inventory_model_1.InventoryModel.find({ product: productId }).session(session);
        if (inventory.length > 0) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({ error: 'Product is used in inventory and cannot be deleted' });
        }
        const orders = yield orderDetail_model_1.OrderDetailModel.find({ product: productId }).session(session);
        if (orders.length > 0) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({ error: 'Product is used in orders and cannot be deleted' });
        }
        const transactions = yield transaction_model_1.TransactionModel.find({ product: productId }).session(session);
        if (transactions.length > 0) {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({ error: 'Product is used in transactions and cannot be deleted' });
        }
        // Удаляем товар
        yield product_model_1.ProductModel.findByIdAndDelete(productId).session(session);
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error.message);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.deleteProduct = deleteProduct;
