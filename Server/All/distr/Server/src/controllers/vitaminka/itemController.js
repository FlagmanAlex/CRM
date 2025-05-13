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
exports.deleteItemById = exports.updateItemById = exports.getItemById = exports.createItem = exports.getAllItems = void 0;
const item_model_1 = require("../../models/item.model"); // Импорт модели Mongoose
// Получить все элементы
const getAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Получение всех элементов'); // Логирование
        const items = yield item_model_1.ItemModel.find(); // Получаем все элементы из базы
        console.log(`Найдено ${items.length} элементов`); // Логирование
        res.json(items);
    }
    catch (error) {
        console.error('Ошибка при получении элементов:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getAllItems = getAllItems;
// Создать новый элемент
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Создание нового элемента:', req.body); // Логирование входных данных
        const newItem = new item_model_1.ItemModel(req.body); // Создаем новый элемент из тела запроса
        const savedItem = yield newItem.save(); // Сохраняем элемент в базе
        console.log('Элемент успешно создан:', savedItem); // Логирование результата
        res.status(201).json(savedItem);
    }
    catch (error) {
        console.error('Ошибка при создании элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.createItem = createItem;
// Получить элемент по ID
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Получение элемента по ID: ${id}`); // Логирование ID
        const item = yield item_model_1.ItemModel.findById(id); // Ищем элемент по ID
        if (!item) {
            console.warn(`Элемент с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент найден:', item); // Логирование результата
        res.json(item);
    }
    catch (error) {
        console.error('Ошибка при получении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getItemById = getItemById;
// Обновить элемент по ID
const updateItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Обновление элемента с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedItem = yield item_model_1.ItemModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем элемент
        if (!updatedItem) {
            console.warn(`Элемент с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент успешно обновлен:', updatedItem); // Логирование результата
        res.json(updatedItem);
    }
    catch (error) {
        console.error('Ошибка при обновлении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.updateItemById = updateItemById;
// Удалить элемент по ID
const deleteItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Удаление элемента с ID: ${id}`); // Логирование ID
        const deletedItem = yield item_model_1.ItemModel.findByIdAndDelete(id); // Удаляем элемент
        if (!deletedItem) {
            console.warn(`Элемент с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент успешно удален:', deletedItem); // Логирование результата
        res.json({ message: 'Элемент успешно удален.' });
    }
    catch (error) {
        console.error('Ошибка при удалении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.deleteItemById = deleteItemById;
