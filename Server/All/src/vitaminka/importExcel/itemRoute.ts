import express from 'express';
import {
    getAllItems,
    createItem,
    getItemById,
    updateItemById,
    deleteItemById,
} from '../controllers/itemController';

export const itemRouter = express.Router();

itemRouter.get('/', getAllItems); // Получить все элементы
itemRouter.get('/:id', getItemById); // Получить элемент по ID
itemRouter.put('/:id', updateItemById); // Обновить элемент по ID
itemRouter.post('/create', createItem); // Создать новый элемент
itemRouter.delete('/:id', deleteItemById); // Удалить элемент по ID
