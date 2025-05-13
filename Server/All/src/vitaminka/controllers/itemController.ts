import { Request, Response, NextFunction } from 'express';
import { ItemModel } from '../models/item.model'; // Импорт модели Mongoose

// Получить все элементы
export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Получение всех элементов'); // Логирование
        const items = await ItemModel.find(); // Получаем все элементы из базы
        console.log(`Найдено ${items.length} элементов`); // Логирование
        res.json(items);
    } catch (error) {
        console.error('Ошибка при получении элементов:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Создать новый элемент
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Создание нового элемента:', req.body); // Логирование входных данных
        const newItem = new ItemModel(req.body); // Создаем новый элемент из тела запроса
        const savedItem = await newItem.save(); // Сохраняем элемент в базе
        console.log('Элемент успешно создан:', savedItem); // Логирование результата
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Ошибка при создании элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Получить элемент по ID
export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Получение элемента по ID: ${id}`); // Логирование ID
        const item = await ItemModel.findById(id); // Ищем элемент по ID
        if (!item) {
            console.warn(`Элемент с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент найден:', item); // Логирование результата
        res.json(item);
    } catch (error) {
        console.error('Ошибка при получении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Обновить элемент по ID
export const updateItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Обновление элемента с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedItem = await ItemModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем элемент
        if (!updatedItem) {
            console.warn(`Элемент с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент успешно обновлен:', updatedItem); // Логирование результата
        res.json(updatedItem);
    } catch (error) {
        console.error('Ошибка при обновлении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Удалить элемент по ID
export const deleteItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Удаление элемента с ID: ${id}`); // Логирование ID
        const deletedItem = await ItemModel.findByIdAndDelete(id); // Удаляем элемент
        if (!deletedItem) {
            console.warn(`Элемент с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Элемент не найден.' });
        }
        console.log('Элемент успешно удален:', deletedItem); // Логирование результата
        res.json({ message: 'Элемент успешно удален.' });
    } catch (error) {
        console.error('Ошибка при удалении элемента:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};