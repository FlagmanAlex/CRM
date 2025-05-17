"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const excel_1 = require("./src/utils/excel");
const document_model_1 = require("./src/vitaminka/models/document.model");
const group_model_1 = require("./src/vitaminka/models/group.model");
const brand_model_1 = require("./src/vitaminka/models/brand.model");
const item_model_1 = require("./src/vitaminka/models/item.model");
const client_model_1 = require("./src/models/client.model");
const paramsDocuments = {
    fileName: '../iHerbРасчетЗатрат.xlsx',
    sheetName: 'HeadJournal',
    range: 'A1:P1000',
    fieldsName: [],
};
const readData = () => __awaiter(void 0, void 0, void 0, function* () {
    const BD_TOKEN = process.env.BD_TOKEN;
    if (!BD_TOKEN) {
        throw new Error('Токен базы данных не найден');
    }
    try {
        yield mongoose_1.default.connect(BD_TOKEN, { dbName: process.env.BD_NAME_MVOK });
        console.log('Соединение с базой MongoDB прошло успешно');
        const documentsExcel = yield (0, excel_1.readExcelRangeToJSon)(paramsDocuments);
        const documents = documentsExcel
            .filter(item => item['№ заказа'])
            .map(documment => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                orderNum: ((_a = documment['№ заказа']) === null || _a === void 0 ? void 0 : _a.text) || documment['№ заказа'].toString(),
                supplier: documment['Поставщик'] || '',
                emexNum: ((_b = documment['№ отслеживания']) === null || _b === void 0 ? void 0 : _b.text) || documment['№ отслеживания'] || '',
                status: documment['Статус доставки'] || '',
                carrier: documment['Перевозчик'] || '',
                carrierNum: ((_c = documment['№ отслеживания перевозчика']) === null || _c === void 0 ? void 0 : _c.text) || documment['№ отслеживания перевозчика'] || '',
                orderDate: documment['Дата заказа'] && !isNaN(Date.parse(documment['Дата заказа']))
                    ? new Date(documment['Дата заказа']).toISOString()
                    : '',
                exchangeRate: ((_d = documment['Курс']) === null || _d === void 0 ? void 0 : _d.result) || documment['Курс'] || 0,
                bonus: ((_e = documment['Вознаграждение UAH']) === null || _e === void 0 ? void 0 : _e.result) || documment['Вознаграждение UAH'] || 0,
                paySum: ((_f = documment['Сумма оплаты факт']) === null || _f === void 0 ? void 0 : _f.result) || documment['Сумма оплаты факт'] || 0,
                logisticSum: ((_g = documment['Логистика RUB']) === null || _g === void 0 ? void 0 : _g.result) || documment['Логистика RUB'] || 0,
            });
        });
        yield document_model_1.Document.deleteMany({});
        yield group_model_1.GroupModel.deleteMany({});
        yield brand_model_1.BrandModel.deleteMany({});
        yield item_model_1.ItemModel.deleteMany({});
        const insertDocuments = yield document_model_1.Document.insertMany(documents.map(document => (Object.assign({}, document))));
        const documentIdMap = new Map(insertDocuments.map((doc) => [doc.orderNum, doc._id]));
        const paramsItems = {
            fileName: '../iHerbРасчетЗатрат.xlsx',
            sheetName: 'Journal',
            range: 'A1:V10000',
            fieldsName: [],
        };
        const itemsExcel = yield (0, excel_1.readExcelRangeToJSon)(paramsItems);
        const uniqueGroups = Array.from(new Set(itemsExcel.map(item => item['Группа'])))
            .map(group => ({ name: group }))
            .filter(item => item.name !== undefined);
        const insertGroups = yield group_model_1.GroupModel.insertMany(uniqueGroups.map(item => (Object.assign({}, item))));
        const groupIdMap = new Map(insertGroups.map(item => [item.name, item._id]));
        const uniqueBrand = Array.from(new Set(itemsExcel.map(item => { var _a; return ((_a = item['Бренд']) === null || _a === void 0 ? void 0 : _a.result) || item['Бренд']; })))
            .map(item => ({ name: (item === null || item === void 0 ? void 0 : item.result) || item }))
            .filter(item => item.name !== undefined);
        const inserBrand = yield brand_model_1.BrandModel.insertMany(uniqueBrand.map(item => (Object.assign({}, item))));
        const brandIdMap = new Map(inserBrand.map(item => [item.name, item._id]));
        const paramsClients = {
            fileName: '../БазаOZON.xlsx',
            sheetName: 'Clients',
            tableName: 'ТабКлиенты',
            fieldsName: []
        };
        const clientsExcel = yield (0, excel_1.readExcelTableToJson)(paramsClients);
        const validClients = clientsExcel
            .filter(client => client.name && typeof client.phone !== 'object')
            .map(client => ({
            name: typeof client.name === 'object' ? client.name.text : client.name,
            phone: typeof client.phone === 'object' ? client.phone.text : client.phone,
            address: client.address,
            gps: client.gps,
            percent: client.percent,
            gender: ''
        }));
        const insertedClients = yield client_model_1.Client.insertMany(validClients.map((client) => (Object.assign({}, client))));
        const clientIdMap = new Map(insertedClients.map((client) => [client.name, client._id]));
        const items = itemsExcel
            .filter(item => item['№ заказа'] !== undefined)
            .map(item => {
            var _a, _b, _c, _d, _e, _f;
            const documentId = documentIdMap.get(item["№ заказа"]);
            const groupId = groupIdMap.get(item['Группа']);
            const brandId = brandIdMap.get(((_a = item['Бренд']) === null || _a === void 0 ? void 0 : _a.result) || item['Бренд']);
            const clientId = clientIdMap.get(item['Клиент']);
            return {
                documentId: new mongoose_1.Types.ObjectId(documentId),
                groupId: groupId instanceof mongoose_1.Types.ObjectId ? new mongoose_1.Types.ObjectId(groupId) : null,
                article: ((_b = item['Артикул']) === null || _b === void 0 ? void 0 : _b.text) || ((_c = item['Артикул']) === null || _c === void 0 ? void 0 : _c.result) || item['Артикул'] || '',
                brandId: brandId instanceof mongoose_1.Types.ObjectId ? new mongoose_1.Types.ObjectId(brandId) : null,
                bonus: ((_d = item['Вознаграждение']) === null || _d === void 0 ? void 0 : _d.result) || 0,
                clientId: clientId instanceof mongoose_1.Types.ObjectId ? new mongoose_1.Types.ObjectId(clientId) : null,
                name: item['Наименование'] || '',
                prevPrice: ((_e = item['Цена закупки']) === null || _e === void 0 ? void 0 : _e.result) || item['Цена закупки'] || 0,
                selsDate: item['ДатаП'] && !isNaN(Date.parse(item['ДатаП'])) ? new Date(item['ДатаП']).toISOString() : '',
                selsPrice: ((_f = item['Продажа RUB']) === null || _f === void 0 ? void 0 : _f.result) || item['Продажа RUB'] || 0,
            };
        });
        const insertItems = yield item_model_1.ItemModel.insertMany(items.map(item => (Object.assign({}, item))));
        console.log(insertItems);
    }
    catch (error) {
        console.error('Ошибка выполнения:', error);
    }
    finally {
        yield mongoose_1.default.disconnect();
        console.log('Соединение с базой закрыто');
    }
});
readData();
