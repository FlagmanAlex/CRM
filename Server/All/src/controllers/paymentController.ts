import { Request, Response } from 'express'
import { Payment } from '../models/payment.model';
import { IPayment, IPaymentClient } from '../../../../Interfaces/IPayment';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const newPayment = new Payment(req.body)
        const savePayment = newPayment.save()
        if (savePayment) {
            res.status(201).json(savePayment)
        }
    } catch (error) {
        console.error('Ошибка создания документа Payment', error)
        res.status(500).json({ message: 'Ошибка создания документа Payment' })
    }
}
export const getPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.find()
            .populate('clientId', 'name')
            .populate('orderId', 'orderNum')
            .lean() as unknown as IPaymentClient[] // Преобразуем в обычные объекты

        console.log(payments);
        const formattedPayments: IPayment[] = payments.map(payment => ({
            _id: payment._id?.toString() || '', // Преобразуем ObjectId в строку
            date: payment.date.toString(), // Преобразуем дату в строку ISO
            orderId: payment.orderId?._id?.toString() || '',
            orderNum: payment.orderId?.orderNum || 0,
            sum: payment.sum,
            clientId: payment.clientId?._id?.toString() || '', // Проверяем clientId на null
            clientName: payment.clientId?.name || 'Unknown', // Добавляем значение по умолчанию
        }));

        // Проверяем, есть ли платежи
        if (formattedPayments.length > 0) {
            res.status(200).json(formattedPayments);
        } else {
            res.status(404).json({ message: 'Нет оплат' });
        }
    } catch (error) {
        console.error('Ошибка сервера', error)
        res.status(404).json({ message: 'Ошибка сервера' })
    }
}
export const getPaymentsByOrderId = async (req: Request, res: Response) => {
    const orderId = req.params.id
    try {
        const payments = await Payment.find({ orderId })
        res.status(200).json(payments)

    } catch (error) {
        console.error('Ошибка сервера', error)
        res.status(404).json({ message: 'Ошибка сервера' })
    }
}
export const updatePayment = async (req: Request, res: Response) => {
    try {
        const updatePayment =
            await Payment.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })

        if (!updatePayment) {
            res.status(404).json({ message: "payment элемент не найден" })
        } else {
            res.status(200).json(updatePayment)
        }
    } catch (error) {
        console.log('Ошибка обновления документа payment', error)
        res.status(500).json({ message: 'Ошибка обновления документа payment' })
    }

}
export const deletePayment = async (req: Request, res: Response) => {
    try {
        const deletePayment = await Payment.findByIdAndDelete(req.params.id)
        if (!deletePayment) {
            res.status(404).json({ message: "Payment не найден" })
        } else {
            res.status(204).json({ message: "Payment удален" })
        }
    } catch (error) {
        console.error('Ошибка удаления документа deletePaytment', error);
        res.status(500).json({ message: 'Ошибка удаления документа deletePaytment' })
    }
}