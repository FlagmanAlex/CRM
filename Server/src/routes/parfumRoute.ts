import express  from 'express'

import {
    createParfum,
    getParfums,
    getParfum,
    deleteParfums,
    updateParfums
} from '../controllers/parfumController'

const router = express.Router()

router.post('/create', createParfum)
router.put('/:id', updateParfums)
router.delete('/:id', deleteParfums)
router.get('/', getParfums)
router.get('/:id', getParfum)

export default router