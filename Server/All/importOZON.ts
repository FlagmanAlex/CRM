import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { readExcelTableToJson } from './src/utils/excel'
import { Client } from './src/models/client.model'
import { Order } from './src/models/order.model'
import { IClient } from '../../Interfaces/IClient'
import { IOrderItem } from '../../Interfaces/IOrderItem'
import { PVZ } from './src/models/Pvz.model'
import { OrderItems } from './src/models/orderItems.model'
import { IExcelImportParams } from '../../Interfaces/IExcelImportParams'

const paramsClients: IExcelImportParams = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'Clients',
    tableName: 'ТабКлиенты',
    fieldsName: []
}

const paramsOrders: IExcelImportParams = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'Orders',
    tableName: 'ТабЗаказы',
    fieldsName: ['orderNum', 'date', 'client', 'percent',]
}

const paramsOrderItems: IExcelImportParams = {
    fileName: '../БазаOZON.xlsx',
    sheetName: 'OrderItems',
    tableName: 'ТабПозиции',
    fieldsName: []
}

const readData = async () => {

    // Получаем токен для подключения к базе данных из переменных окружения
    const BD_TOKEN = process.env.BD_TOKEN;

    // Читаем данные из Excel-файла для клиентов и заказов
    const clientsExcel = await readExcelTableToJson(paramsClients)
    const ordersExcel = await readExcelTableToJson(paramsOrders);
    const orderItemsExcel = await readExcelTableToJson(paramsOrderItems);

    // Преобразуем данные заказов в нужный формат
    const orders = ordersExcel.map((order) => {
        return {
            orderNum: order.orderNum.result || order.orderNum, // Номер заказа
            date: order.date,               // Дата заказа
            client: order.client,           // Имя клиента
            percent: order.percent?.result || null, // Процент (если есть)
        };
    });

    // Подключаемся к MongoDB, используя токен и имя базы данных
    if (BD_TOKEN) {
        mongoose
            .connect(BD_TOKEN, { dbName: process.env.BD_NAME_OZON })
            .then(() => {
                console.log('Соединение с базой MongoDB прошло успешно');
            })
            .catch((e) => console.log(`Ошибка подключения к MongoDB: ${e.message}`));
    }

    // Удаляем все записи из коллекций клиентов и заказов перед вставкой новых данных
    await Client.deleteMany({});
    await Order.deleteMany({});
    await PVZ.deleteMany({})

    const validClients: IClient[] = clientsExcel
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

        }
        ))

    // Вставляем данные клиентов в базу данных
    const insertedClients = await Client.insertMany(
        validClients.map((client) => ({
            ...client
        }))
    );

    // Создаем маппинг (сопоставление) name -> _id для клиентов
    const clientIdMap = new Map(
        insertedClients.map((client) => [client.name, client._id])
    );

    // Обновляем массив заказов, заменяя client на clientId
    const updatedOrders = orders.map((order) => ({
        ...order,
        clientId: clientIdMap.get(order.client) || null, // Если client не найден, ставим null
    }));

    // Фильтруем заказы, оставляя только те, у которых есть orderNum и clientId
    const validOrders = updatedOrders.filter((order) => order.orderNum && order.clientId);

    // Вставляем валидные заказы в базу данных
    const insertedOrders = await Order.insertMany(validOrders.map((order) => ({
        ...order,
    })));

    // Создаем маппинг (сопоставление) orderNum -> _id для заказов
    const orderIdMap = new Map(
        insertedOrders.map((order) => [order.orderNum, order._id])
    );

    const uniquePvzName = Array.from(
        new Set(orderItemsExcel.map(item => item.pvzName)
            .filter(pvzName => pvzName !== undefined)
            .map(pvzName => ({ name: pvzName }))))

    const insertPvz = await PVZ.insertMany(uniquePvzName.map(pvz => {
        return { ...pvz }
    }))

    const pvzIdMap = new Map(
        insertPvz.map((pvz) => [pvz.name, pvz._id])
    );

    const validOrderItems: IOrderItem[] = orderItemsExcel
        .filter(orderItem => orderItem.orderNum)
        .map((orderItem) => (
            {
                orderId: (orderIdMap.get(orderItem.orderNum) as string) || '',
                item: orderItem.item?.text || orderItem.item,
                url: orderItem.item?.hyperlink || '',
                dateTo: orderItem.date?.result || '',
                quantity: orderItem.quantity || 0,
                price: orderItem.price?.result || orderItem.price || 0,
                payment: orderItem.payment?.result || orderItem.payment,
                pvzId: (pvzIdMap.get(orderItem.pvzName) as string) || '',
                ord: orderItem.ord,
                pai: orderItem.pai?.result || orderItem.pai,
                rec: orderItem.rec,
                ship: orderItem.ship?.result || orderItem.ship,
                deliveryPost: orderItem.deliveryPost,
                discountPrice: orderItem.discountPrice?.result || orderItem.discountPrice || 0,
                courierNumber: orderItem.adboard || '',
            }
        ))
        .filter(orderItem => orderItem.orderId)

    const insertOrderItems = await OrderItems.insertMany(validOrderItems.map(orderItem => ({
        ...orderItem
    })))

    console.log(validOrderItems);

    // Отключаемся от базы данных
    await mongoose.disconnect();
    console.log('Соединение с базой закрыто');
};

// Запускаем функцию для выполнения всех операций
readData();
