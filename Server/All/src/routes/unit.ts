const express = require('express')
const { createUnit, 
        updateUnit, 
        deleteUnit, 
        getUnits, 
        getUnit } = require('../controllers/unit')
        
const router = express.Router()

router.post('/create', createUnit)
router.patch('/:id', updateUnit)
router.delete('/:id', deleteUnit)
router.get('/', getUnits)
router.get('/:id', getUnit)

export default router