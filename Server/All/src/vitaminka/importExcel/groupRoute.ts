import express from 'express';
import {
    getAllGroups,
    createGroup,
    getGroupById,
    updateGroupById,
    deleteGroupById,
} from '../controllers/groupController';

export const groupRouter = express.Router();

groupRouter.get('/', getAllGroups); // Получить все группы
groupRouter.get('/:id', getGroupById); // Получить группу по ID
groupRouter.put('/:id', updateGroupById); // Обновить группу по ID
groupRouter.post('/create', createGroup); // Создать новую группу
groupRouter.delete('/:id', deleteGroupById); // Удалить группу по ID
