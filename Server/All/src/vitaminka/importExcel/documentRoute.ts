import express from 'express';
import {
    getAllDocuments,
    createDocument,
    getDocumentById,
    updateDocumentById,
    deleteDocumentById,
} from '../controllers/documentController';

export const documentRouter = express.Router();

documentRouter.get('/', getAllDocuments); // Получить все документы
documentRouter.get('/:id', getDocumentById); // Получить документ по ID
documentRouter.put('/:id', updateDocumentById); // Обновить документ по ID
documentRouter.post('/create', createDocument); // Создать новый документ
documentRouter.delete('/:id', deleteDocumentById); // Удалить документ по ID

