"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRouter = void 0;
const express_1 = __importDefault(require("express"));
const documentController_1 = require("../controllers/documentController");
exports.documentRouter = express_1.default.Router();
exports.documentRouter.get('/', documentController_1.getAllDocuments); // Получить все документы
exports.documentRouter.get('/:id', documentController_1.getDocumentById); // Получить документ по ID
exports.documentRouter.put('/:id', documentController_1.updateDocumentById); // Обновить документ по ID
exports.documentRouter.post('/create', documentController_1.createDocument); // Создать новый документ
exports.documentRouter.delete('/:id', documentController_1.deleteDocumentById); // Удалить документ по ID
