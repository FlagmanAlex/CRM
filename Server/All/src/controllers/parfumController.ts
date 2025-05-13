import { Request, Response } from 'express'
import { Parfum } from '../models/product.model'
import { deleteFile } from '../utils/file'


export const getParfum = async function(req: Request, res: Response) {
    try {
        
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}

export const getParfums = async function(req: Request, res: Response) {
    try {
        const parfums = await Parfum.find()
        res.status(200).json(parfums)
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}

export const createParfum = async function(req: Request, res: Response) {
    try {
        const newParfum = new Parfum(req.body)
        await newParfum.save()
        res.status(201).json(newParfum)
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
export const updateParfums = async function(req: Request, res: Response) {
    try {
        const { id } = req.params
        console.log(`Вход в update, ${id}`);
        const result = await Parfum.findByIdAndUpdate(id, req.body, { new: true})
        if (result) res.status(200).json(`Элемент с id=${id} обновлен!`)
        else res.status(404).json(`Элемент с id=${id} не найден`)

    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
export const deleteParfums = async function(req: Request, res: Response) {
    try {
        const { id } = req.params
        console.log(`Вход в delete, ${id}`);
        const result = await Parfum.findById(id)
        if (result) {
            deleteFile(result.pathOriginImageBottle)
            deleteFile(result.pathEssenceImageBottle)
            await result.deleteOne()
            res.status(200).json(`Элемент с id=${id} удален!`)
        }
        else res.status(404).json(`Элемент с id=${id} не найден`)
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
