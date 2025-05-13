import { Request, Response } from 'express'
import { Unit } from '../models/unit.model'

export const getUnit = async function(req: Request, res: Response) {
    
}
export const getUnits = async function(req: Request, res: Response) {
    
}
export const createUnit = async function(req: Request, res: Response) {
    try {
        const newUnit = new Unit(req.body)
        await newUnit.save()
        res.status(201).json(newUnit)
    } catch (error) {
        console.error(error);        
        res.status(400).json({message: 'Ошибка создания Unit'})
    }
}
export const updateUnit = async function(req: Request, res: Response) {
    
}
export const deleteUnit = async function(req: Request, res: Response) {
    
}
