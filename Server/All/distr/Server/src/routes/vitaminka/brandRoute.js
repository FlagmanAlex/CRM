"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRouter = void 0;
const express_1 = __importDefault(require("express"));
const brandController_1 = require("../../controllers/vitaminka/brandController");
exports.brandRouter = express_1.default.Router();
exports.brandRouter.get('/', brandController_1.getAllBrands); // Получить все бренды
exports.brandRouter.get('/:id', brandController_1.getBrandById); // Получить бренд по ID
exports.brandRouter.put('/:id', brandController_1.updateBrandById); // Обновить бренд по ID
exports.brandRouter.post('/create', brandController_1.createBrand); // Создать новый бренд
exports.brandRouter.delete('/:id', brandController_1.deleteBrandById); // Удалить бренд по ID
