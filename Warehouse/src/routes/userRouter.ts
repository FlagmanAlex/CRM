import express from 'express';
import { body } from 'express-validator'
import { userController } from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

export const userRouter = express.Router();

// Публичные маршруты
userRouter.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('username').notEmpty()
], userController.register); 
userRouter.post('/login', userController.login);
// Защищённые маршруты
userRouter.get('/profile', authMiddleware, userController.getProfile); 
userRouter.get('/users', authMiddleware, adminMiddleware, userController.getUsers);
// Только для админов
userRouter.patch('/users/:id/role', authMiddleware, adminMiddleware, userController.updateRole);
