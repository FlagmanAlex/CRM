import express from 'express'
import { createUser, 
        updateUser, 
        deleteUser, 
        getUsers, 
        getUser}  from '../controllers/userController'
        
const router = express.Router()

router.post('/create', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.get('/', getUsers)
router.get('/:id', getUser)


export default router