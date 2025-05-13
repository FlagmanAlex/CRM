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
const mongoose_1 = __importDefault(require("mongoose"));
const excel_1 = require("./src/utils/excel");
const client_model_1 = require("./src/models/client.model");
const order_model_1 = require("./src/models/order.model");
const Pvz_model_1 = require("./src/models/Pvz.model");
const orderItems_model_1 = require("./src/models/orderItems.model");
const paramsClients = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'Clients',
    tableName: 'ТабКлиенты',
    fieldsName: []
};
const paramsOrders = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'Orders',
    tableName: 'ТабЗаказы',
    fieldsName: ['orderNum', 'date', 'client', 'percent',]
};
const paramsOrderItems = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'OrderItems',
    tableName: 'ТабПозиции',
    fieldsName: []
};
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Получаем токен для подключения к базе данных из переменных окружения
    const BD_TOKEN = process.env.BD_TOKEN;
    // Читаем данные из Excel-файла для клиентов и заказов
    const clientsExcel = yield (0, excel_1.readExcelTableToJson)(paramsClients);
    const ordersExcel = yield (0, excel_1.readExcelTableToJson)(paramsOrders);
    const orderItemsExcel = yield (0, excel_1.readExcelTableToJson)(paramsOrderItems);
    // Преобразуем данные заказов в нужный формат
    const orders = ordersExcel.map((order) => {
        var _a;
        return {
            orderNum: order.orderNum.result || order.orderNum, // Номер заказа
            date: order.date, // Дата заказа
            client: order.client, // Имя клиента
            percent: ((_a = order.percent) === null || _a === void 0 ? void 0 : _a.result) || null, // Процент (если есть)
        };
    });
    // Подключаемся к MongoDB, используя токен и имя базы данных
    if (BD_TOKEN) {
        mongoose_1.default
            .connect(BD_TOKEN, { dbName: process.env.BD_NAME_OZON })
            .then(() => {
            console.log('Соединение с базой MongoDB прошло успешно');
        })
            .catch((e) => console.log(`Ошибка подключения к MongoDB: ${e.message}`));
    }
    // Удаляем все записи из коллекций клиентов и заказов перед вставкой новых данных
    yield client_model_1.Client.deleteMany({});
    yield order_model_1.Order.deleteMany({});
    yield Pvz_model_1.PVZ.deleteMany({});
    const validClients = clientsExcel
        .filter(client => client.name && typeof client.phone !== 'object')
        .map(client => ({
        name: typeof client.name === 'object' ?
            client.name.text :
            client.name,
        phone: typeof client.phone === 'object' ?
            client.phone.text :
            client.phone,
        address: client.address,
        gps: client.gps,
        percent: client.percent,
        gender: ''
    }));
    // Вставляем данные клиентов в базу данных
    const insertedClients = yield client_model_1.Client.insertMany(validClients.map((client) => (Object.assign({}, client))));
    // Создаем маппинг (сопоставление) name -> _id для клиентов
    const clientIdMap = new Map(insertedClients.map((client) => [client.name, client._id]));
    // Обновляем массив заказов, заменяя client на clientId
    const updatedOrders = orders.map((order) => (Object.assign(Object.assign({}, order), { clientId: clientIdMap.get(order.client) || null })));
    // Фильтруем заказы, оставляя только те, у которых есть orderNum и clientId
    const validOrders = updatedOrders.filter((order) => order.orderNum && order.clientId);
    // Вставляем валидные заказы в базу данных
    const insertedOrders = yield order_model_1.Order.insertMany(validOrders.map((order) => (Object.assign({}, order))));
    // Создаем маппинг (сопоставление) orderNum -> _id для заказов
    const orderIdMap = new Map(insertedOrders.map((order) => [order.orderNum, order._id]));
    const uniquePvzName = Array.from(new Set(orderItemsExcel.map(item => item.pvzName)
        .filter(pvzName => pvzName !== undefined)
        .map(pvzName => ({ name: pvzName }))));
    const insertPvz = yield Pvz_model_1.PVZ.insertMany(uniquePvzName.map(pvz => {
        return Object.assign({}, pvz);
    }));
    const pvzIdMap = new Map(insertPvz.map((pvz) => [pvz.name, pvz._id]));
    const validOrderItems = orderItemsExcel
        .filter(orderItem => orderItem.orderNum)
        .map((orderItem) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return ({
            orderId: orderIdMap.get(orderItem.orderNum) || '',
            item: ((_a = orderItem.item) === null || _a === void 0 ? void 0 : _a.text) || orderItem.item,
            url: ((_b = orderItem.item) === null || _b === void 0 ? void 0 : _b.hyperlink) || '',
            dateTo: ((_c = orderItem.date) === null || _c === void 0 ? void 0 : _c.result) || '',
            quantity: orderItem.quantity || 0,
            price: ((_d = orderItem.price) === null || _d === void 0 ? void 0 : _d.result) || orderItem.price || 0,
            payment: ((_e = orderItem.payment) === null || _e === void 0 ? void 0 : _e.result) || orderItem.payment,
            pvzId: pvzIdMap.get(orderItem.pvzName) || '',
            ord: orderItem.ord,
            pai: ((_f = orderItem.pai) === null || _f === void 0 ? void 0 : _f.result) || orderItem.pai,
            rec: orderItem.rec,
            ship: ((_g = orderItem.ship) === null || _g === void 0 ? void 0 : _g.result) || orderItem.ship,
            deliveryPost: orderItem.deliveryPost,
            discountPrice: ((_h = orderItem.discountPrice) === null || _h === void 0 ? void 0 : _h.result) || orderItem.discountPrice || 0,
            courierNumber: orderItem.adboard || '',
        });
    })
        .filter(orderItem => orderItem.orderId);
    const insertOrderItems = yield orderItems_model_1.OrderItems.insertMany(validOrderItems.map(orderItem => (Object.assign({}, orderItem))));
    console.log(validOrderItems);
    // Отключаемся от базы данных
    yield mongoose_1.default.disconnect();
    console.log('Соединение с базой закрыто');
});
// Запускаем функцию для выполнения всех операций
readData();
