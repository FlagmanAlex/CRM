import { Request, Response } from 'express'

import { User } from '../models/user.model'

export const getUser = async function(req: Request, res: Response) {
    try {
        const user_id = req.params.id
        const user = await User.find({user_id: user_id})
        console.log(user_id);
                
        res.status(200).json(user)
    } catch (error) {
        if (error) res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}

export const getUsers = async function(req: Request, res: Response) {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}

export const createUser = async function(req: Request, res: Response) {
    try {
        const id = req.body.user_id
        const result = await User.findOneAndUpdate({user_id: id}, req.body, { new: true})
        
        if (result) res.status(200).json(result)
        else {
            const newUser = new User(req.body)
            await newUser.save()
            res.status(201).json(newUser)
        }
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
export const updateUser = async function(req: Request, res: Response) {
    try {
        const { id } = req.params
        console.log(`Вход в update, ${id}`);
        const result = await User.findByIdAndUpdate(id, req.body, { new: true})
        if (result) res.status(200).json(`Элемент с id=${id} обновлен!`)
        else res.status(404).json(`Элемент с id=${id} не найден`)

    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
export const deleteUser = async function(req: Request, res: Response) {
    try {
        const { id } = req.params
        console.log(`Вход в delete, ${id}`);
        const result = await User.findById(id)
        if (result) {
            await result.deleteOne()
            res.status(200).json(`Элемент с id=${id} удален!`)
        }
        else res.status(404).json(`Элемент с id=${id} не найден`)
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}

export const checkAuth = async function(req: Request, res: Response) {
    const hash = req.query.hash
    console.log(hash);
    

    try {
        const user = await User.findOne({hash})
        
        if (user) {
            console.log(user.user_id);
            res.status(200).json({userId: user.user_id})
        } else {
            res.status(404).json({error: 'User not faund'})
        }
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
