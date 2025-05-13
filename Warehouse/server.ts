import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { categoryRouter } from './src/routes/categoryRouter';
import { productRouter } from './src/routes/productRouter';
import { userRouter } from './src/routes/userRouter'
import { warehouseRouter } from './src/routes/warehouseRouter'

dotenv.config()

const BD_NAME = process.env.BD_NAME_WAREHOUSE
const BD_TOKEN = process.env.BD_TOKEN
const port = process.env.PORT || 3000;

if (BD_TOKEN) mongoose.connect(BD_TOKEN, { dbName: BD_NAME })
    .then(() => { console.log('Соединение с базой MongoDB прошло успешно') })
    .catch(e => console.log(`Ошибка подключения к MongoDB: ${e.message}`))

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/auth', userRouter)
app.use('/api/warehouses', warehouseRouter);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
