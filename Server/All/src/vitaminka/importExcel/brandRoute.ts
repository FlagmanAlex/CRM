import express from 'express';
import {
    getAllBrands,
    createBrand,
    getBrandById,
    updateBrandById,
    deleteBrandById,
} from '../controllers/brandController';

export const brandRouter = express.Router();

brandRouter.get('/', getAllBrands); // Получить все бренды
brandRouter.get('/:id', getBrandById); // Получить бренд по ID
brandRouter.put('/:id', updateBrandById); // Обновить бренд по ID
brandRouter.post('/create', createBrand); // Создать новый бренд
brandRouter.delete('/:id', deleteBrandById); // Удалить бренд по ID

