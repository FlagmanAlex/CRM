import { Router } from 'express';
import { productController } from '../controllers/productController';
import { body } from 'express-validator';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware';

export const productRouter = Router();

productRouter.post('/', [
    body('name').notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('category').isMongoId(),
    body('supplier').isMongoId()
], productController.createProduct);                                // Создание товара
productRouter.get('/', productController.getProducts);              // Получение списка товаров (с фильтрами и пагинацией)
productRouter.get('/:id', productController.getProductById);        // Получение товара по ID
productRouter.put('/:id', productController.updateProduct);         // Обновление товара
productRouter.patch('/:id/archive', 
    authMiddleware, 
    adminMiddleware, 
    productController.archiveProduct
);                                                                  // Архивирование товара
productRouter.get('/search', productController.searchProducts);     // Поиск товаров по названию
productRouter.get('/supplier/:supplierId', 
    productController.getSupplierProducts
);                                                                  // Получение товаров поставщика
