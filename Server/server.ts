import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import unitRoute from './src/routes/unit'
import parfumRoute from './src/routes/parfumRoute'
import fileRoute from './src/routes/fileRoute'
import userRoute from './src/routes/userRoute'
import authRoute from './src/routes/authRoute'
import clientRoute from './src/routes/clientRoute'

import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import TelegramBot, { Message }  from 'node-telegram-bot-api'
const botToken = process.env.BOT_TOKEN
import { User } from './src/models/user.model'

if (!botToken) {
    throw new Error('BOT_TOKEN не указан в переменных окружения');
}

const bot = new TelegramBot(botToken, {polling: true})
const imagePath = path.join(__dirname, 'src/images')

const app = express()
const BD_TOKEN = process.env.BD_TOKEN

if (BD_TOKEN) mongoose.connect(BD_TOKEN, {dbName: process.env.BD_NAME_MVOK})  
        .then(()=>{console.log('Соединение с базой MongoDB прошло успешно')})
        .catch(e=>console.log(`Ошибка подключения к MongoDB: ${e.message}`))


app.use(cors())

app.use('/images', express.static(imagePath))

app.use(bodyParser.json())
app.use('uploads', express.static('uploads'))

app.use('/api/unit', unitRoute)
app.use('/api/parfum', parfumRoute)
app.use('/api/file', fileRoute)

app.use('/api/user', userRoute)

app.use('/api/auth', authRoute)
app.use('/api/client', clientRoute)

const port = process.env.port || 5001

app.listen(port, () => console.log(`Сервер запущен на ${port} порту`))

bot.onText(/\/start (.+)/, (msg: Message, match) => {
    // Сохранение данных пользователя в базе данных
    setUser(msg, match)
})

const setUser = async (msg: Message, match?: RegExpMatchArray | null) => {
    const chat_id = msg.chat.id
    const user_id = msg.from?.id
    const firstName = msg.from?.first_name
    const userName = msg.from?.username
    const hash = match ? match[1] : '' // Извлечение хэша из ссылки

    try {
        const user = await User.findOne({user_id})        
        if (user) {
            user.loginHistory.push({hash})
            await user.save()
            bot.sendMessage(chat_id, `Информация была обновлена.`)
        } else {
            const newUser = new User({
                chat_id: chat_id,
                user_id: user_id,
                first_name: firstName,
                username: userName,
                loginHistory: [{hash: hash}]
            })
            await newUser.save();
            bot.sendMessage(chat_id, `${firstName}, авторизация прошла успешно! Вы можете вернуться в приложение.`);
        }
            
    } catch (error) {
        bot.sendMessage(chat_id, 'Произошла ошибка при сохранении данных.');
        console.error(error);
    }
}

bot.on('message', async (msg) => {

    
    const chat_id = msg.chat.id
    
    if (msg.text === '/start') {
        setUser(msg)
        try {
            bot.sendMessage(chat_id, 'Добро пожаловать в Мир ВитаминОК!\n '
                 + 'Вы также можете связаться со мной лично и подписаться на мой канал.', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Связаться со мной',
                                url: 'https://olga_vitamins.t.me'
                            }
                        ],
                        [
                            {
                                text: 'Подпишитесь на наш канал',
                                url: 'https://formula_myhealth.t.me' 
                            }
                        ]
                    ]
                }
            })
            
        } catch (error) {
            console.log((error as NodeJS.ErrnoException).message);
            
        }
    } 
    // if (msg.photo) {
    //     const fileId = msg.photo[msg.photo.length -1].file_id
    //     const caption = msg.caption || ''
    //     const captionEntities = msg.caption_entities

    //     try {
    //         await bot.sendPhoto(chat_id, fileId, {
    //             caption: caption,
    //             caption_entities: captionEntities,
    //             reply_markup: {
    //                 inline_keyboard: [
    //                     [
    //                         {text: 'Наш канал', url: 'https://formula_myhealth.t.me'},
    //                         {text: 'Написать мне', url: 'https://olga_vitamins.t.me'}
    //                     ]
    //                 ]
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error.message);
            
    //     }
    // }
    
})
