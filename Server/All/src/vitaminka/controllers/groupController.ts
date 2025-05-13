import { Request, Response, NextFunction } from 'express';
import { GroupModel } from '../models/group.model'; // Импорт модели Mongoose

// Получить все группы
export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Получение всех групп'); // Логирование
        const groups = await GroupModel.find(); // Получаем все группы из базы
        console.log(`Найдено ${groups.length} групп`); // Логирование
        res.json(groups);
    } catch (error) {
        console.error('Ошибка при получении групп:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Создать новую группу
export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Создание новой группы:', req.body); // Логирование входных данных
        const newGroup = new GroupModel(req.body); // Создаем новую группу из тела запроса
        const savedGroup = await newGroup.save(); // Сохраняем группу в базе
        console.log('Группа успешно создана:', savedGroup); // Логирование результата
        res.status(201).json(savedGroup);
    } catch (error) {
        console.error('Ошибка при создании группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Получить группу по ID
export const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Получение группы по ID: ${id}`); // Логирование ID
        const group = await GroupModel.findById(id); // Ищем группу по ID
        if (!group) {
            console.warn(`Группа с ID ${id} не найдена`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа найдена:', group); // Логирование результата
        res.json(group);
    } catch (error) {
        console.error('Ошибка при получении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Обновить группу по ID
export const updateGroupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Обновление группы с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedGroup = await GroupModel.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем группу
        if (!updatedGroup) {
            console.warn(`Группа с ID ${id} не найдена для обновления`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа успешно обновлена:', updatedGroup); // Логирование результата
        res.json(updatedGroup);
    } catch (error) {
        console.error('Ошибка при обновлении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};

// Удалить группу по ID
export const deleteGroupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Удаление группы с ID: ${id}`); // Логирование ID
        const deletedGroup = await GroupModel.findByIdAndDelete(id); // Удаляем группу
        if (!deletedGroup) {
            console.warn(`Группа с ID ${id} не найдена для удаления`); // Логирование предупреждения
            res.status(404).send({ error: 'Группа не найдена.' });
        }
        console.log('Группа успешно удалена:', deletedGroup); // Логирование результата
        res.json({ message: 'Группа успешно удалена.' });
    } catch (error) {
        console.error('Ошибка при удалении группы:', error); // Логирование ошибки
        next(error); // Передаем ошибку в Express
    }
};