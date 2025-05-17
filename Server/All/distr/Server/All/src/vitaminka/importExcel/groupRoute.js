"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRouter = void 0;
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
exports.groupRouter = express_1.default.Router();
exports.groupRouter.get('/', groupController_1.getAllGroups); // Получить все группы
exports.groupRouter.get('/:id', groupController_1.getGroupById); // Получить группу по ID
exports.groupRouter.put('/:id', groupController_1.updateGroupById); // Обновить группу по ID
exports.groupRouter.post('/create', groupController_1.createGroup); // Создать новую группу
exports.groupRouter.delete('/:id', groupController_1.deleteGroupById); // Удалить группу по ID
