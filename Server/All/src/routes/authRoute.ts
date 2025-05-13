import express from 'express'
import  { checkAuth } from '../controllers/authController'
        
const router = express.Router()

router.get('/check', checkAuth)

export default router