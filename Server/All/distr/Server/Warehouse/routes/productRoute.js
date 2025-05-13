"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = void 0;
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
exports.productRoute = express_1.default.Router();
exports.productRoute.get('api/products/active', productController_1.getActive);
exports.productRoute.put('/products/:productId/archive', productController_1.archiveProduct);
exports.productRoute.delete('/products/:productId', productController_1.deleteProduct);
