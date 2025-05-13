import express from 'express'
import multer from 'multer'
import { del, upl } from '../controllers/fileController'

const router = express.Router()

//router.post('/upload', uploadFile)


// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage })

router.post('/upload', upload.single('image'), upl)
router.delete('/:fileName', del)

export default router