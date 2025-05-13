import { NextFunction, Request, Response } from 'express';
import { Document } from '../models/document.model'; // Импорт модели Mongoose

// Получить все документы
export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        console.log('Получение всех документов'); // Логирование
        const documents = await Document.find(); // Получаем все документы из базы
        console.log(`Найдено ${documents.length} документов`); // Логирование
        res.status(200).json(documents);
    } catch (error) {
        console.error('Ошибка при получении документов:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документов.' });
    }
};

// Создать новый документ
export const createDocument = async (req: Request, res: Response) => {
    try {
        console.log('Создание нового документа:', req.body); // Логирование входных данных
        const newDocument = new Document(req.body); // Создаем новый документ из тела запроса
        const savedDocument = await newDocument.save(); // Сохраняем документ в базе
        console.log('Документ успешно создан:', savedDocument); // Логирование результата
        res.status(201).json(savedDocument);
    } catch (error) {
        console.error('Ошибка при создании документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документов.' });
    }
};

// Получить документ по ID
export const getDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        console.log(`Получение документа по ID: ${id}`); // Логирование ID
        const document = await Document.findById(id); // Ищем документ по ID
        if (!document) {
            console.log(`Документ с ID ${id} не найден`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ найден:', document); // Логирование результата
        res.status(200).json(document);
    } catch (error) {
        console.error('Ошибка при получении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при получении документа.' });
    }
};

// Обновить документ по ID
export const updateDocumentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`Обновление документа с ID: ${id}`, req.body); // Логирование ID и данных
        const updatedDocument = await Document.findByIdAndUpdate(id, req.body, { new: true }); // Обновляем документ
        if (!updatedDocument) {
            console.log(`Документ с ID ${id} не найден для обновления`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ успешно обновлен:', updatedDocument); // Логирование результата
        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error('Ошибка при обновлении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при обновлении документа.' });
    }
};

// Удалить документ по ID
export const deleteDocumentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`Удаление документа с ID: ${id}`); // Логирование ID
        const deletedDocument = await Document.findByIdAndDelete(id); // Удаляем документ
        if (!deletedDocument) {
            console.log(`Документ с ID ${id} не найден для удаления`); // Логирование предупреждения
            res.status(404).json({ message: 'Документ не найден.' });
        }
        console.log('Документ успешно удален:', deletedDocument); // Логирование результата
        res.status(200).json({ message: 'Документ успешно удален.' });
    } catch (error) {
        console.error('Ошибка при удалении документа:', error); // Логирование ошибки
        res.status(500).json({ message: 'Произошла ошибка при удалении документа.' });
    }
};