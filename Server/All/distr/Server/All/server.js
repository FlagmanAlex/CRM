"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const unit_1 = __importDefault(require("./src/routes/unit"));
const parfumRoute_1 = __importDefault(require("./src/routes/parfumRoute"));
const fileRoute_1 = __importDefault(require("./src/routes/fileRoute"));
const userRoute_1 = __importDefault(require("./src/routes/userRoute"));
const authRoute_1 = __importDefault(require("./src/routes/authRoute"));
const clientRoute_1 = require("./src/routes/clientRoute");
const orderRoutes_1 = require("./src/routes/orderRoutes");
const paymentRoute_1 = require("./src/routes/paymentRoute");
const documentRoute_1 = require("./src/vitaminka/importExcel/documentRoute");
const brandRoute_1 = require("./src/vitaminka/importExcel/brandRoute");
const groupRoute_1 = require("./src/vitaminka/importExcel/groupRoute");
const itemRoute_1 = require("./src/vitaminka/importExcel/itemRoute");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const botToken = process.env.BOT_TOKEN;
const user_model_1 = require("./src/models/user.model");
if (!botToken) {
    throw new Error('BOT_TOKEN не указан в переменных окружения');
}
const bot = new node_telegram_bot_api_1.default(botToken, { polling: true });
const imagePath = path_1.default.join(__dirname, 'src/images');
const app = (0, express_1.default)();
const BD_TOKEN = process.env.BD_TOKEN;
if (BD_TOKEN)
    mongoose_1.default.connect(BD_TOKEN, { dbName: process.env.BD_NAME_MVOK })
        .then(() => { console.log('Соединение с базой MongoDB прошло успешно'); })
        .catch(e => console.log(`Ошибка подключения к MongoDB: ${e.message}`));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/images', express_1.default.static(imagePath));
app.use('uploads', express_1.default.static('uploads'));
app.use('/api/unit', unit_1.default);
app.use('/api/parfum', parfumRoute_1.default);
app.use('/api/file', fileRoute_1.default);
app.use('/api/user', userRoute_1.default);
app.use('/api/auth', authRoute_1.default);
app.use('/api/client', clientRoute_1.clientRoute);
app.use('/api/order', orderRoutes_1.orderRoute);
app.use('/api/payment', paymentRoute_1.paymentRoute);
app.use('/api/vitaminka/document', documentRoute_1.documentRouter);
app.use('/api/vitaminka/item', itemRoute_1.itemRouter);
app.use('/api/vitaminka/brand', brandRoute_1.brandRouter);
app.use('/api/vitaminka/group', groupRoute_1.groupRouter);
const port = process.env.port || 5001;
app.listen(port, () => console.log(`Сервер запущен на ${port} порту`));
bot.onText(/\/start (.+)/, (msg, match) => {
    // Сохранение данных пользователя в базе данных
    setUser(msg, match);
});
const setUser = (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const chat_id = msg.chat.id;
    const user_id = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
    const firstName = (_b = msg.from) === null || _b === void 0 ? void 0 : _b.first_name;
    const userName = (_c = msg.from) === null || _c === void 0 ? void 0 : _c.username;
    const hash = match ? match[1] : ''; // Извлечение хэша из ссылки
    try {
        const user = yield user_model_1.User.findOne({ user_id });
        if (user) {
            user.loginHistory.push({ hash });
            yield user.save();
            bot.sendMessage(chat_id, `Информация была обновлена.`);
        }
        else {
            const newUser = new user_model_1.User({
                chat_id: chat_id,
                user_id: user_id,
                first_name: firstName,
                username: userName,
                loginHistory: [{ hash: hash }]
            });
            yield newUser.save();
            bot.sendMessage(chat_id, `${firstName}, авторизация прошла успешно! Вы можете вернуться в приложение.`);
        }
    }
    catch (error) {
        bot.sendMessage(chat_id, 'Произошла ошибка при сохранении данных.');
        console.error(error);
    }
});
bot.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chat_id = msg.chat.id;
    if (msg.text === '/start') {
        setUser(msg);
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
            });
        }
        catch (error) {
            console.log(error.message);
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
}));
