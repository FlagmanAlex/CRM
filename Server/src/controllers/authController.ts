import { Request, Response } from 'express'
import { User } from '../models/user.model'

export const checkAuth = async function(req: Request, res: Response) {
    const hash = req.query.hash
    
    try {
        const user = await User.findOne({
            loginHistory: {
                $elemMatch: {hash: hash}
            }
        })
        
        if (user) {
            res.status(200).json({
                exist: true,
                user_id: user.user_id,
                roles: user.roles
            })
        } else {
            res.status(404).json({
                exist: false, 
                error: 'Такого пользователя нет в базе'
            })
        }
    } catch (error) {
        res.status(400).json((error as NodeJS.ErrnoException).message)
    }
}
