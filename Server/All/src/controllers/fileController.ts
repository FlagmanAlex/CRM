// server/controllers/parfumController.js
import {Request, Response} from 'express'
import { Parfum } from '../models/product.model'
import { deleteFile } from '../utils/file'

// Загрузка файла
export const upl = (req: Request, res: Response) => {
    res.status(200).json({ imageUrl: req.file?.filename })
}
export const del = (req: Request, res: Response) => {
    const { fileName } = req.params
    deleteFile(fileName)
    res.status(200).json('Фалй удален')
}