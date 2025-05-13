import { Request, Response, NextFunction } from 'express';
import { BrandModel } from '../models/brand.model'; // Импорт модели Mongoose

// Получить все бренды
export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Получение всех брендов'); // Логирование
        const brands = await BrandModel.find(); // Получаем все бренды из базы
        console.log(`Найдено ${brands.length} брендов`); // Логирование
        res.json(brands);
    } catch (error) {
        console.error('Ошибка при получении брендов:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Создать новый бренд
export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Создание нового бренда:', req.body); // Логирование входных данных
        const newBrand = new BrandModel(req.body); // Создаем новый бренд из тела запроса
        const savedBrand = await newBrand.save(); // Сохраняем бренд в базе
        console.log('Бренд успешно создан:', savedBrand); // Логирование результата
        res.status(201).json(savedBrand);
    } catch (error) {
        console.error('Ошибка при создании бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Получить бренд по ID
export const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Получение бренда по ID: ${id}`); // Логирование ID
        const brand = await BrandModel.findById(id); // Ищем бренд по ID
        if (!brand) {
            console.warn(`Бренд с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд найден:', brand); // Логирование результата
        res.json(brand);
    } catch (error) {
        console.error('Ошибка при получении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Обновить бренд по ID
export const updateBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Обновление бренда с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedBrand = await BrandModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем бренд
        if (!updatedBrand) {
            console.warn(`Бренд с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд успешно обновлен:', updatedBrand); // Логирование результата
        res.json(updatedBrand);
    } catch (error) {
        console.error('Ошибка при обновлении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Удалить бренд по ID
export const deleteBrandById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Удаление бренда с ID: ${id}`); // Логирование ID
        const deletedBrand = await BrandModel.findByIdAndDelete(id); // Удаляем бренд
        if (!deletedBrand) {
            console.warn(`Бренд с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Бренд не найден.' });
        }
        console.log('Бренд успешно удален:', deletedBrand); // Логирование результата
        res.json({ message: 'Бренд успешно удален.' });
    } catch (error) {
        console.error('Ошибка при удалении бренда:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};