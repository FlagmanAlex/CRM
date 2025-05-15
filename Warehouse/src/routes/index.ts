import { Router } from 'express'
import { categoryRouter } from './categoryRouter';
import { productRouter } from './productRouter';
import { userRouter } from './userRouter';
import { warehouseRouter } from './warehouseRouter';
import { batchRouter } from './batchRouter';
import { customerRouter } from './customerRouter';
import { inventoryRouter } from './inventoryRouter';
import { orderRouter } from './orderRouter';
import { orderDetailsRouter } from './orderDetailsRouter';
import { priceHistoryRouter } from './priceHistoryRouter';
import { supplierRouter } from './supplierRouter';
import { transactionRouter } from './transactionRouter';

export const mainRouter = Router()

mainRouter.use('/category', categoryRouter);
mainRouter.use('/product', productRouter);
mainRouter.use('/auth', userRouter)
mainRouter.use('/warehouse', warehouseRouter);
mainRouter.use('/batch', batchRouter);
mainRouter.use('/customer', customerRouter);
mainRouter.use('/inventory', inventoryRouter);
mainRouter.use('/order', orderRouter);
mainRouter.use('/order-details', orderDetailsRouter);
mainRouter.use('/price-history', priceHistoryRouter);
mainRouter.use('/supplier', supplierRouter);
mainRouter.use('/transaction', transactionRouter);