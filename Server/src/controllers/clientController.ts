import { Client } from '../models/client.model'
import { Response, Request } from 'express'

export const getClients = async (req: Request, res: Response) => {
    try {
        const response = await Client.find()
        res.status(200).json(response)
    } catch (error) {
        console.error((error as NodeJS.ErrnoException).message);        
        res.status(500).json({message: 'Ошибка сервера. попробуйте позже'})
    }
}
export const getClient = async (req: Request, res: Response) => {
    try {
        const clientId = req.params.id
        const client = await Client.findById(clientId)

        if (!client) res.status(404).json({message: 'Клиент не найден'})
        else res.status(200).json(client)

    } catch (error) {
        console.log('Ошибка базы данных', error)        
        res.status(500).json({message: 'Ошибка сервера. попробуйте позже'})
    }
}
//Создание нового клиента в базе
export const createClient = async (req: Request, res: Response) => {
    try {
        const newClient = new Client(req.body)
        const saveClient = await newClient.save()
        res.status(201).json(saveClient)
        
    } catch (error) {
        console.log('Ошибка базы данных', error)
        res.status(500).json({message: 'Ошибка создания клиента'})
    }
}
//Удаление нового клиента в базе
export const deleteClient = async (req: Request, res: Response) => {
    try {
        console.log('deleteClient', req.params.id);
        const deletedClient = await Client.findByIdAndDelete(req.params.id)
        if (!deletedClient) {
            res.status(404).json({message: "Клиент не найден"})
        }
        res.status(204).json({message: "Клиент удален"})
        
    } catch (error) {
        console.log('Ошибка базы данных', error)
        res.status(500).json({message: 'Ошибка сервера. попробуйте позже'})
    }
}
//Обновление клиента в базе
export const updateClient = async (req: Request, res: Response) => {
    try {
        const updatedClient = 
            await Client.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })
        if (!updateClient) {
            res.status(404).json({message: "Клиент не найден"})
        }
        res.status(200).json(updateClient)
        console.log("UpdateClient");
        
    } catch (error) {
        console.log('Ошибка обновления клиента', error)
        res.status(500).json({message: 'Ошибка обновления клиента'})
    }
}