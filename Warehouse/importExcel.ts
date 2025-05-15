import { IExcelImportParams } from './src/interfaces/IExcelImportParams';
import dotenv from 'dotenv'
dotenv.config()
import mongoose, { ObjectId } from 'mongoose'
import { readExcelRangeToJSon } from './src/utils/excel';
import { IUser } from './src/interfaces/IUser';
import { UserModel } from './src/models/userModel';
import { SupplierModel } from './src/models/supplierModel';
import { CustomerModel } from './src/models/customerModel';

const host = process.env.HOST
const port = process.env.PORT

console.log(host, port);


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

        // Удаляем все записи из коллекций клиентов и заказов перед вставкой новых данных
        await UserModel.deleteMany({});
        await SupplierModel.deleteMany({});
        await CustomerModel.deleteMany({});

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
        const userId = data.user._id


        await addSumpliers(paramsHeadJournal, userId)
        await addClients(paramsClient, userId)

    } catch (error) {
        console.error('Ошибка выполнения:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Соединение с базой закрыто');
    }
}

readData()

/**
 * Импорт поставщиков из Excel
 * @param paramsHeadJournal Параметры таблицы Excel для импорта
 * @param userId Создатель записи
 */
const addSumpliers = async (paramsHeadJournal: IExcelImportParams, userId: ObjectId) => {

    //Загружаем данные заголовков журнала
    const hJ = await readExcelRangeToJSon(paramsHeadJournal);

    const headJournal = hJ
        .filter(item => item['№ заказа'])
        .map(documment => ({
            orderNum: documment['№ заказа']?.text || documment['№ заказа'].toString(),
            orderDate: documment['Дата заказа'] && !isNaN(Date.parse(documment['Дата заказа']))
                ? new Date(documment['Дата заказа']).toISOString()
                : '',
            supplier: documment['Поставщик'] || '',
            emexNum: documment['№ отслеживания']?.text || documment['№ отслеживания'] || '',
            status: documment['Статус доставки'] || '',
            carrier: documment['Перевозчик'] || '',
            carrierNum: documment['№ отслеживания перевозчика']?.text || documment['№ отслеживания перевозчика'] || '',
            exchangeRate: documment['Курс']?.result || documment['Курс'] || 0,
            bonus: documment['Вознаграждение UAH']?.result || documment['Вознаграждение UAH'] || 0,
            paySum: documment['Сумма оплаты факт']?.result || documment['Сумма оплаты факт'] || 0,
            logisticSum: documment['Логистика RUB']?.result || documment['Логистика RUB'] || 0,
        }));
    const supplier = headJournal.map((item) => (item.supplier))

    const uniqueSupplier: { name: string, userId: ObjectId }[] = supplier.reduce((acc, item) => {
        if (!acc.some((supp: { name: string }) => supp.name === item)) {
            acc.push({
                name: item,
                userId: userId
            })
        }
        return acc
    }, [] as { name: string, userId: ObjectId }[])

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
 * Импорт таблицы клиентов из Excel
 * @param paramsClient Параметры таблицы Excel для импорта
 * @param userId Создатель записи
 */
const addClients = async (paramsClient: IExcelImportParams, userId: ObjectId) => {
    //Загружаем данные клиентов
    const cl = await readExcelRangeToJSon(paramsClient);
    const validClients = cl
        .filter(client => client.name && typeof client.phone !== 'object')
        .map((client) => ({
            name: typeof client.name === 'object' ?
                client.name.text :
                client.name,
            phone: typeof client.phone === 'object' ?
                client.phone.text :
                client.phone,
            address: client.address,
            gps: client.gps,
            percent: client.percent,
            accountManager: userId,
        }
        ))

    validClients.map(async (item) => {
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
