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
exports.deleteGroupById = exports.updateGroupById = exports.getGroupById = exports.createGroup = exports.getAllGroups = void 0;
const group_model_1 = require("../../models/group.model"); // Импорт модели Mongoose
// Получить все группы
const getAllGroups = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Получение всех групп'); // Логирование
        const groups = yield group_model_1.GroupModel.find(); // Получаем все группы из базы
        console.log(`Найдено ${groups.length} групп`); // Логирование
        res.json(groups);
    }
    catch (error) {
        console.error('Ошибка при получении групп:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getAllGroups = getAllGroups;
// Создать новую группу
const createGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Создание новой группы:', req.body); // Логирование входных данных
        const newGroup = new group_model_1.GroupModel(req.body); // Создаем новую группу из тела запроса
        const savedGroup = yield newGroup.save(); // Сохраняем группу в базе
        console.log('Группа успешно создана:', savedGroup); // Логирование результата
        res.status(201).json(savedGroup);
    }
    catch (error) {
        console.error('Ошибка при создании группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.createGroup = createGroup;
// Получить группу по ID
const getGroupById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Получение группы по ID: ${id}`); // Логирование ID
        const group = yield group_model_1.GroupModel.findById(id); // Ищем группу по ID
        if (!group) {
            console.warn(`Группа с ID ${id} не найдена`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа найдена:', group); // Логирование результата
        res.json(group);
    }
    catch (error) {
        console.error('Ошибка при получении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getGroupById = getGroupById;
// Обновить группу по ID
const updateGroupById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Обновление группы с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedGroup = yield group_model_1.GroupModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем группу
        if (!updatedGroup) {
            console.warn(`Группа с ID ${id} не найдена для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа успешно обновлена:', updatedGroup); // Логирование результата
        res.json(updatedGroup);
    }
    catch (error) {
        console.error('Ошибка при обновлении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.updateGroupById = updateGroupById;
// Удалить группу по ID
const deleteGroupById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Удаление группы с ID: ${id}`); // Логирование ID
        const deletedGroup = yield group_model_1.GroupModel.findByIdAndDelete(id); // Удаляем группу
        if (!deletedGroup) {
            console.warn(`Группа с ID ${id} не найдена для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа успешно удалена:', deletedGroup); // Логирование результата
        res.json({ message: 'Группа успешно удалена.' });
    }
    catch (error) {
        console.error('Ошибка при удалении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.deleteGroupById = deleteGroupById;
