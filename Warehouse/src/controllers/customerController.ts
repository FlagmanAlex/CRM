import { Request, Response } from 'express';
import { CustomerModel } from '../models/customerModel';

export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await CustomerModel.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

export const createCustomer = async (req: Request, res: Response) => {
    try {
        const newCustomer = new CustomerModel(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
};
