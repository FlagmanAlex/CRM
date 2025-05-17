"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRouter = void 0;
const express_1 = __importDefault(require("express"));
const itemController_1 = require("../controllers/itemController");
exports.itemRouter = express_1.default.Router();
exports.itemRouter.get('/', itemController_1.getAllItems); // Получить все элементы
exports.itemRouter.get('/:id', itemController_1.getItemById); // Получить элемент по ID
exports.itemRouter.put('/:id', itemController_1.updateItemById); // Обновить элемент по ID
exports.itemRouter.post('/create', itemController_1.createItem); // Создать новый элемент
exports.itemRouter.delete('/:id', itemController_1.deleteItemById); // Удалить элемент по ID
