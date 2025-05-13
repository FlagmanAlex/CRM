import express from 'express';
import { warehouseController } from '../controllers/warehouseController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import { body } from 'express-validator';

export const warehouseRouter = express.Router();

// Создание и удаление - только для админов
warehouseRouter.post('/', [
    authMiddleware,
    adminMiddleware,
    body('name').notEmpty().trim(),
    body('capacity').optional().isFloat({ gt: 0 })
], warehouseController.createWarehouse);

warehouseRouter.delete('/:id', [
    authMiddleware,
    adminMiddleware
], warehouseController.deleteWarehouse);

// Обновление - админ или назначенный менеджер
warehouseRouter.put('/:id', [
    authMiddleware,
    body('name').optional().trim(),
    body('capacity').optional().isFloat({ gt: 0 })
], warehouseController.updateWarehouse);

// Просмотр - доступен всем авторизованным
warehouseRouter.get('/', authMiddleware, warehouseController.getWarehouses);
warehouseRouter.get('/:id', authMiddleware, warehouseController.getWarehouseById);