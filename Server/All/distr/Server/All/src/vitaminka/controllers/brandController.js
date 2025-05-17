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
exports.deleteBrandById = exports.updateBrandById = exports.getBrandById = exports.createBrand = exports.getAllBrands = void 0;
const brand_model_1 = require("../models/brand.model"); // Импорт модели Mongoose
// Получить все бренды
const getAllBrands = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Получение всех брендов'); // Логирование
        const brands = yield brand_model_1.BrandModel.find(); // Получаем все бренды из базы
        console.log(`Найдено ${brands.length} брендов`); // Логирование
        res.json(brands);
    }
    catch (error) {
        console.error('Ошибка при получении брендов:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getAllBrands = getAllBrands;
// Создать новый бренд
const createBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Создание нового бренда:', req.body); // Логирование входных данных
        const newBrand = new brand_model_1.BrandModel(req.body); // Создаем новый бренд из тела запроса
        const savedBrand = yield newBrand.save(); // Сохраняем бренд в базе
        console.log('Бренд успешно создан:', savedBrand); // Логирование результата
        res.status(201).json(savedBrand);
    }
    catch (error) {
        console.error('Ошибка при создании бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.createBrand = createBrand;
// Получить бренд по ID
const getBrandById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Получение бренда по ID: ${id}`); // Логирование ID
        const brand = yield brand_model_1.BrandModel.findById(id); // Ищем бренд по ID
        if (!brand) {
            console.warn(`Бренд с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд найден:', brand); // Логирование результата
        res.json(brand);
    }
    catch (error) {
        console.error('Ошибка при получении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.getBrandById = getBrandById;
// Обновить бренд по ID
const updateBrandById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Обновление бренда с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedBrand = yield brand_model_1.BrandModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем бренд
        if (!updatedBrand) {
            console.warn(`Бренд с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд успешно обновлен:', updatedBrand); // Логирование результата
        res.json(updatedBrand);
    }
    catch (error) {
        console.error('Ошибка при обновлении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.updateBrandById = updateBrandById;
// Удалить бренд по ID
const deleteBrandById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(`Удаление бренда с ID: ${id}`); // Логирование ID
        const deletedBrand = yield brand_model_1.BrandModel.findByIdAndDelete(id); // Удаляем бренд
        if (!deletedBrand) {
            console.warn(`Бренд с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд успешно удален:', deletedBrand); // Логирование результата
        res.json({ message: 'Бренд успешно удален.' });
    }
    catch (error) {
        console.error('Ошибка при удалении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
});
exports.deleteBrandById = deleteBrandById;
