import dotenv from 'dotenv'
dotenv.config()
import mongoose, { Types } from 'mongoose'
import { readExcelRangeToJSon, readExcelTableToJson } from './src/utils/excel'
import { IExcelImportParams } from '../../Interfaces/IExcelImportParams'
import { IDocument } from '../../Interfaces/IDocument'
import { Document } from './src/vitaminka/models/document.model'
import { IItem } from '../../Interfaces/IItem'
import { GroupModel } from './src/vitaminka/models/group.model'
import { BrandModel } from './src/vitaminka/models/brand.model'
import { ItemModel } from './src/vitaminka/models/item.model'
import { IClient } from '../../Interfaces/IClient'
import { Client } from './src/models/client.model'


const paramsDocuments: IExcelImportParams = {
    fileName: '../iHerbРасчетЗатрат.xlsx',
    sheetName: 'HeadJournal',
    range: 'A1:P1000',
    fieldsName: [],
}

const readData = async () => {
    const BD_TOKEN = process.env.BD_TOKEN;

    if (!BD_TOKEN) {
        throw new Error('Токен базы данных не найден');
    }

    try {
        await mongoose.connect(BD_TOKEN, { dbName: process.env.BD_NAME_MVOK });
        console.log('Соединение с базой MongoDB прошло успешно');

        const documentsExcel = await readExcelRangeToJSon(paramsDocuments);

        const documents: IDocument[] = documentsExcel
            .filter(item => item['№ заказа'])
            .map(documment => ({
                orderNum: documment['№ заказа']?.text || documment['№ заказа'].toString(),
                supplier: documment['Поставщик'] || '',
                emexNum: documment['№ отслеживания']?.text || documment['№ отслеживания'] || '',
                status: documment['Статус доставки'] || '',
                carrier: documment['Перевозчик'] || '',
                carrierNum: documment['№ отслеживания перевозчика']?.text || documment['№ отслеживания перевозчика'] || '',
                orderDate: documment['Дата заказа'] && !isNaN(Date.parse(documment['Дата заказа']))
                    ? new Date(documment['Дата заказа']).toISOString()
                    : '',
                exchangeRate: documment['Курс']?.result || documment['Курс'] || 0,
                bonus: documment['Вознаграждение UAH']?.result || documment['Вознаграждение UAH'] || 0,
                paySum: documment['Сумма оплаты факт']?.result || documment['Сумма оплаты факт'] || 0,
                logisticSum: documment['Логистика RUB']?.result || documment['Логистика RUB'] || 0,
            }));

        await Document.deleteMany({});
        await GroupModel.deleteMany({});
        await BrandModel.deleteMany({});
        await ItemModel.deleteMany({});

        const insertDocuments = await Document.insertMany(documents.map(document => ({ ...document })));
        const documentIdMap = new Map(insertDocuments.map((doc) => [doc.orderNum, doc._id]));

        const paramsItems: IExcelImportParams = {
            fileName: '../iHerbРасчетЗатрат.xlsx',
            sheetName: 'Journal',
            range: 'A1:V10000',
            fieldsName: [],
        };
        const itemsExcel = await readExcelRangeToJSon(paramsItems);

        const uniqueGroups = Array.from(new Set(itemsExcel.map(item => item['Группа'])))
            .map(group => ({ name: group }))
            .filter(item => item.name !== undefined);

        const insertGroups = await GroupModel.insertMany(uniqueGroups.map(item => ({ ...item })));
        const groupIdMap = new Map(insertGroups.map(item => [item.name, item._id]));

        const uniqueBrand = Array.from(new Set(itemsExcel.map(item =>
            item['Бренд']?.result || item['Бренд']
        )))
            .map(item => ({ name: item?.result || item }))
            .filter(item => item.name !== undefined);

        const inserBrand = await BrandModel.insertMany(uniqueBrand.map(item => ({ ...item })));
        const brandIdMap = new Map(inserBrand.map(item => [item.name, item._id]));

        const paramsClients: IExcelImportParams = {
            fileName: '../БазаOZON.xlsx',
            sheetName: 'Clients',
            tableName: 'ТабКлиенты',
            fieldsName: []
        };

        const clientsExcel = await readExcelTableToJson(paramsClients);

        const validClients: IClient[] = clientsExcel
            .filter(client => client.name && typeof client.phone !== 'object')
            .map(client => ({
                name: typeof client.name === 'object' ? client.name.text : client.name,
                phone: typeof client.phone === 'object' ? client.phone.text : client.phone,
                address: client.address,
                gps: client.gps,
                percent: client.percent,
                gender: ''
            }));

        const insertedClients = await Client.insertMany(validClients.map((client) => ({ ...client })));
        const clientIdMap = new Map(insertedClients.map((client) => [client.name, client._id]));

        const items: IItem[] = itemsExcel
            .filter(item => item['№ заказа'] !== undefined)
            .map(item => {
                const documentId = documentIdMap.get(item["№ заказа"]);
                const groupId = groupIdMap.get(item['Группа']);
                const brandId = brandIdMap.get(item['Бренд']?.result || item['Бренд']);
                const clientId = clientIdMap.get(item['Клиент']);

                return {
                    documentId: new Types.ObjectId(documentId),
                    groupId: groupId instanceof Types.ObjectId ? new Types.ObjectId(groupId) : null,
                    article: item['Артикул']?.text || item['Артикул']?.result || item['Артикул'] || '',
                    brandId: brandId instanceof Types.ObjectId ? new Types.ObjectId(brandId) : null,
                    bonus: item['Вознаграждение']?.result || 0,
                    clientId: clientId instanceof Types.ObjectId ? new Types.ObjectId(clientId) : null,
                    name: item['Наименование'] || '',
                    prevPrice: item['Цена закупки']?.result || item['Цена закупки'] || 0,
                    selsDate: item['ДатаП'] && !isNaN(Date.parse(item['ДатаП'])) ? new Date(item['ДатаП']).toISOString() : '',
                    selsPrice: item['Продажа RUB']?.result || item['Продажа RUB'] || 0,
                };
            });

        const insertItems = await ItemModel.insertMany(items.map(item => ({ ...item })));
        console.log(insertItems);
    } catch (error) {
        console.error('Ошибка выполнения:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Соединение с базой закрыто');
    }
};

readData();
