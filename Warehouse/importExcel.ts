import { IExcelImportParams } from './src/interfaces/IExcelImportParams';
import dotenv from 'dotenv'
dotenv.config()
import mongoose, { Types } from 'mongoose'
import { readExcelRangeToJSon } from './src/utils/excel';
import { IUser } from './src/interfaces/IUser';
import { UserModel } from './src/models/userModel';
import { SupplierModel } from './src/models/supplierModel';
import { CustomerModel } from './src/models/customerModel';
import { CategoryModel } from './src/models/categoryModel';
import { WarehouseModel } from './src/models/warehouseModel';
import { ICustomer } from './src/interfaces/ICustomer';
import { body } from 'express-validator';
import { ICategory } from './src/interfaces/ICategory';

interface IJournal {
    '№ заказа': string
    '№ отслеживания': string
    'Поставщик': string
    'Статус': string
    'ДатаЗ': string
    'Группа': string
    'Артикул': string
    'Бренд': string
    'Наименование': string
    'Цена закупки': number
    'Bonus': number
    'Вознаграждение': number
    'Разница в оплате': number
    'Логистика': number
    'Итоговая цена RUB': number
    'Продажа RUB': number
    'ДатаП': string
    'Клиент': string
    'МесяцП': string
    'Чистая прибыль RUB': number
    '% наценки': number
}
interface IHeadJournal {
    '№ заказа': string
    '№ отслеживания': string
    'Поставщик': string
    'Статус доставки': string
    'Перевозчик': string
    '№ отслеживания перевозчика': string
    'Дата заказа': string
    'Курс': number
    'Вознаграждение UAH': number
    'Общий итог iHerb UAH': number
    'Сумма оплаты факт USD': number
    'Логистика RUB': number
    'Итого закупка RUB': number
    'Итого продажа RUB': number
    'Чистая прибыль RUB': number
    '% наценки': number
}
interface IClient {
    name: string
    phone: string
    address: string
    gps: string
    percent: number

}

const host = process.env.HOST
const port = process.env.PORT


const paramsHeadJournal: IExcelImportParams = {
    fileName: '../iHerbРасчетЗатрат.xlsx',
    sheetName: 'HeadJournal',
    range: 'A1:P1000',
    fieldsName: [],
}
const paramsJournal: IExcelImportParams = {
    fileName: '../iHerbРасчетЗатрат.xlsx',
    sheetName: 'Journal',
    range: 'A1:V10000',
    fieldsName: [],
}
const paramsClient: IExcelImportParams = {
    fileName: '../iHerbРасчетЗатрат.xlsx',
    sheetName: 'Clients',
    range: 'A1:E500',
    fieldsName: [],
}

const readData = async () => {

    const BD_TOKEN = process.env.BD_TOKEN;

    if (!BD_TOKEN) {
        throw new Error('Токен базы данных не найден');
    }

    try {
        await mongoose.connect(BD_TOKEN, { dbName: process.env.BD_NAME_WAREHOUSE });
        console.log('Соединение с базой MongoDB прошло успешно');

        // Удаляем User перед созданием
        await UserModel.deleteMany({});

        const createUser: IUser = {
            username: 'Flagman',
            password: '2816509017',
            email: 'flagman25@mail.ru',
            role: 'admin'
        }
        const respUser = await fetch(`${host}:${port}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createUser)
        })

        const data = await respUser.json()
        const userId: Types.ObjectId = data.user._id
        const token = data.token
        console.log(data);


        const journals: IJournal[] = await getJournal(paramsJournal)
        const headJournals: IHeadJournal[] = await getHeadJournal(paramsHeadJournal)
        const clients: IClient[] = await getClient(paramsClient)

        await addAllCollection(journals, headJournals, clients, userId, token)

    } catch (error) {
        console.error('Ошибка выполнения:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Соединение с базой закрыто');
    }
}

readData()

/**
 * Удаленеи всх коллекций и пересоздание их заново
 * @param journals[] 
 * @param headJournals[] 
 * @param clients[] 
 * @param userId
 * @param token
 */
const addAllCollection = async (
    journals: IJournal[],
    headJournals: IHeadJournal[],
    clients: IClient[],
    userId: Types.ObjectId,
    token: string
) => {
    try {
        //1. Последователное удаление всех коллекций
        await SupplierModel.deleteMany({});
        await CustomerModel.deleteMany({});
        await CategoryModel.deleteMany({})
        await WarehouseModel.deleteMany({})
        //2. Создание новых коллекций и загрузка данных
        //        await addCustomers(clients, userId)
        //await addSuppliers(headJournals, userId)
        // await addWarehouse(journals, userId, token)
        await addCategoty(journals, userId, token)
        console.log('Все операции успешно завершены');
    } catch (error) {
        console.log('Ошибка при обновлении коллекций', (error as Error).message);
    }
}

/**
 * Импорт Journal и его валидация
 * @param paramsJournal 
 * @returns journal[]
 */
const getJournal = async (paramsJournal: IExcelImportParams): Promise<IJournal[]> => {
    const importJ = await readExcelRangeToJSon(paramsJournal)
    const journal: IJournal[] = importJ
        .filter(item => item['№ заказа'])
        .map(item => ({
            "№ заказа": item["№ заказа"],
            "№ отслеживания": item["№ отслеживания"]?.result || item["№ отслеживания"],
            'Поставщик': item["Поставщик"]?.result || item["Поставщик"],
            'Статус': item["Статус"]?.result || item["Статус"],
            'ДатаЗ': item["ДатаЗ"]?.result || item["ДатаЗ"],
            'МесяцЗ': item["МесяцЗ"]?.result || item["МесяцЗ"],
            'Группа': item["Группа"]?.result || item["Группа"],
            'Артикул': item["Артикул"]?.result || item["Артикул"],
            'Бренд': item["Бренд"]?.result || item["Бренд"],
            'Наименование': item["Наименование"]?.result || item["Наименование"],
            "Цена закупки": item["Цена закупки"]?.result || item["Цена закупки"],
            'Bonus': item['Bonus']?.result || item["Bonus"],
            'Вознаграждение':
                !(item["Вознаграждение"] instanceof Object) ? item["Вознаграждение"] :
                    item["Вознаграждение"]?.result || 0,
            "Разница в оплате": item["Разница в оплате"]?.result || item["Разница в оплате"],
            'Логистика': item["Логистика"]?.result || item["Логистика"],
            "Итоговая цена RUB": item["Итоговая цена RUB"]?.result || item["Итоговая цена RUB"],
            "Продажа RUB": item["Продажа RUB"]?.result || item["Продажа RUB"],
            'ДатаП': item["ДатаП"]?.result || item["ДатаП"],
            'Клиент': item["Клиент"]?.result || item["Клиент"],
            'МесяцП': item["МесяцП"]?.result || item["МесяцП"],
            "Чистая прибыль RUB": item["Чистая прибыль RUB"]?.result || item["Чистая прибыль RUB"],
            "% наценки": item["% наценки"]?.result || item["% наценки"],
        }))
    return journal
}
/**
 * Загрузка таблицы HeadJournal и его валидация
 * @param paramsHeadJournal
 * @returns headJournal[]
 */
const getHeadJournal = async (paramsHeadJournal: IExcelImportParams): Promise<IHeadJournal[]> => {
    const hJ = await readExcelRangeToJSon(paramsHeadJournal);
    const headJournal: IHeadJournal[] = hJ
        .filter(item => item['№ заказа'])
        .map(documment => ({
            "№ заказа": documment['№ заказа']?.text || documment['№ заказа'].toString(),
            "Дата заказа": documment['Дата заказа'] && !isNaN(Date.parse(documment['Дата заказа']))
                ? new Date(documment['Дата заказа']).toISOString()
                : '',
            'Поставщик': documment['Поставщик'] || '',
            "№ отслеживания": documment['№ отслеживания']?.text || documment['№ отслеживания'] || '',
            "Статус доставки": documment['Статус доставки'] || '',
            'Перевозчик': documment['Перевозчик'] || '',
            "№ отслеживания перевозчика": documment['№ отслеживания перевозчика']?.text || documment['№ отслеживания перевозчика'] || '',
            'Курс': documment['Курс']?.result || documment['Курс'] || 0,
            "Вознаграждение UAH": documment['Вознаграждение UAH']?.result || documment['Вознаграждение UAH'] || 0,
            "Сумма оплаты факт USD": documment['Сумма оплаты факт USD']?.result || documment['Сумма оплаты факт USD'] || 0,
            "Логистика RUB": documment['Логистика RUB']?.result || documment['Логистика RUB'] || 0,
            "% наценки": documment['% наценки']?.result || documment['% наценки'] || 0,
            "Итого закупка RUB": documment['Итого закупка RUB']?.result || documment['Итого закупка RUB'] || 0,
            "Итого продажа RUB": documment['Итого продажа RUB']?.result || documment['Итого продажа RUB'] || 0,
            "Общий итог iHerb UAH": documment['Общий итог iHerb UAH']?.result || documment['Общий итог iHerb UAH'] || 0,
            "Чистая прибыль RUB": documment['Чистая прибыль RUB']?.result || documment['Чистая прибыль RUB'] || 0,
        }));

    return headJournal
}

/**
 * Загрузка таблицы Clients и его валидация
 * @param paramsClient 
 * @returns clients[]
 */
const getClient = async (paramsClient: IExcelImportParams): Promise<IClient[]> => {
    const importClients = await readExcelRangeToJSon(paramsClient);
    const clients: IClient[] = importClients
        .filter(client => client.name)
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
        }))

    return clients
}

/**
 * Импорт поставщиков из Excel
 * @param headJournal[]
 * @param userId
 */
const addSuppliers = async (headJournal: IHeadJournal[], userId: Types.ObjectId) => {

    const supplier = headJournal.map((item) => (item['Поставщик']))

    const uniqueSupplier: { name: string, userId: Types.ObjectId }[] = supplier.reduce((acc, item) => {
        if (!acc.some((supp: { name: string }) => supp.name === item)) {
            acc.push({
                name: item,
                userId: userId
            })
        }
        return acc
    }, [] as { name: string, userId: Types.ObjectId }[])

    uniqueSupplier.map(async (item) => {
        try {
            await fetch(`${host}:${port}/api/supplier/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            })
        } catch (error) {
            console.log(error);

        }
    })
}
/**
 * Добавление клиентов в customer
 * @param clients[]
 * @param userId
 */
const addCustomers = async (clients: IClient[], userId: Types.ObjectId) => {
    //Загружаем данные клиентов
    const customer: ICustomer[] = clients.map((item) => (
        {
            name: item.name,
            address: item.address,
            phone: item.phone,
            gps: item.gps,
            percent: item.percent,
            accountManager: userId,
        }
    ))
    customer.map(async (item) => {
        try {
            await fetch(`${host}:${port}/api/customer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            })
        } catch (error) {
            console.log(error);

        }
    })

}
/**
 * Создание таблицы складов из стоблца Группы
 * @param journal[]
 * @param userId Создатель записи
 * @param token
 */
const addWarehouse = async (journal: IJournal[], userId: Types.ObjectId, token: string) => {

    const uniqueWarehouse = Array.from(new Set(journal.map(item => item['Группа'])))
        .map(group => ({ name: group }))
        .filter(item => item.name !== undefined);
    uniqueWarehouse.map(async item => {
        try {
            const response = await fetch(`${host}:${port}/api/warehouse/`, {
                body: JSON.stringify({ name: item.name, userId }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
            })
            const data = await response.json()
            console.log(data);

        } catch (error) {
            console.log('Ошибка сервере', (error as Error).message);
        }
    })

}
/**
 * Создание таблицы категорий для продукции
 * @param journals[] 
 * @param userId 
 * @param token 
 */
const addCategoty = async (journals: IJournal[], userId: Types.ObjectId, token: string) => {
    //Создание root категории и Получение rootId 
    try {
        const root = await fetch(`${host}:${port}/api/category`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ name: 'Категории товаров' }),
            method: 'POST'
        })
        const rootData = await root.json()
        const rootId = rootData._id

        //Полуучение уникальных значений из journals, создание массива категорий и запись в базу.
        const uniqueCategory: ICategory[] = Array.from(new Set(journals.map(item => item['Бренд'])))
            .filter(item => item)
            .map(item => ({ name: item, parentCategory: rootId }))
        uniqueCategory.map(async item => {
            const response = await fetch(`${host}:${port}/api/category`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(item),
                method: 'POST',
            })
            const data = await response.json()
            console.log(data);
        })
    } catch (error) {
        console.log('Ошибка сервера', (error as Error).message);
    }
}