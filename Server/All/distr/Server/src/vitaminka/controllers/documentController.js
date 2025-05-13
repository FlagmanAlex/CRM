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
exports.deleteDocumentById = exports.updateDocumentById = exports.getDocumentById = exports.createDocument = exports.getAllDocuments = void 0;
const document_model_1 = require("../models/document.model"); // Импорт модели Mongoose
// Получить все документы
const getAllDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Получение всех документов'); // Логирование
        const documents = yield document_model_1.Document.find(); // Получаем все документы из базы
        console.log(`Найдено ${documents.length} документов`); // Логирование
        res.status(200).json(documents);
    }
    catch (error) {
        console.error('Ошибка при получении документов:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документов.' });
    }
});
exports.getAllDocuments = getAllDocuments;
// Создать новый документ
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Создание нового документа:', req.body); // Логирование входных данных
        const newDocument = new document_model_1.Document(req.body); // Создаем новый документ из тела запроса
        const savedDocument = yield newDocument.save(); // Сохраняем документ в базе
        console.log('Документ успешно создан:', savedDocument); // Логирование результата
        res.status(201).json(savedDocument);
    }
    catch (error) {
        console.error('Ошибка при создании документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документов.' });
    }
});
exports.createDocument = createDocument;
// Получить документ по ID
const getDocumentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Получение документа по ID: ${id}`); // Логирование ID
        const document = yield document_model_1.Document.findById(id); // Ищем документ по ID
        if (!document) {
            console.log(`Документ с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ найден:', document); // Логирование результата
        res.status(200).json(document);
    }
    catch (error) {
        console.error('Ошибка при получении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документа.' });
    }
});
exports.getDocumentById = getDocumentById;
// Обновить документ по ID
const updateDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Обновление документа с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedDocument = yield document_model_1.Document.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем документ
        if (!updatedDocument) {
            console.log(`Документ с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ успешно обновлен:', updatedDocument); // Логирование результата
        res.status(200).json(updatedDocument);
    }
    catch (error) {
        console.error('Ошибка при обновлении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при обновлении документа.' });
    }
});
exports.updateDocumentById = updateDocumentById;
// Удалить документ по ID
const deleteDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Удаление документа с ID: ${id}`); // Логирование ID
        const deletedDocument = yield document_model_1.Document.findByIdAndDelete(id); // Удаляем документ
        if (!deletedDocument) {
            console.log(`Документ с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ успешно удален:', deletedDocument); // Логирование результата
        res.status(200).json({ message: 'Документ успешно удален.' });
    }
    catch (error) {
        console.error('Ошибка при удалении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при удалении документа.' });
    }
});
exports.deleteDocumentById = deleteDocumentById;
