import express from 'express';
import { getAllCustomers, createCustomer } from '../controllers/customerController';

export const customerRouter = express.Router();

// Получение списка всех клиентов
customerRouter.get('/', getAllCustomers);

// Создание нового клиента
customerRouter.post('/', createCustomer);