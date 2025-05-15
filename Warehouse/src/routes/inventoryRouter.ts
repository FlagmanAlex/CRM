import express from 'express';
import { InventoryController } from '../controllers/inventoryController';

export const inventoryRouter = express.Router();

// Остатки на складе
inventoryRouter.get('/warehouse/:warehouseId', InventoryController.getInventoryByWarehouse);

// Остатки товаров на всех складах
inventoryRouter.get('/product/:productId', InventoryController.getInventoryByProduct);

// Ручное обновление остатков (инвентаризация)
inventoryRouter.put('/adjust', InventoryController.updateInventory);