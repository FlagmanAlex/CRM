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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClient = exports.deleteClient = exports.createClient = exports.getClient = exports.getClients = void 0;
const client_model_1 = require("../models/client.model");
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client_model_1.Client.find();
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.getClients = getClients;
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        const client = yield client_model_1.Client.findById(clientId);
        if (!client)
            res.status(404).json({ message: 'Клиент не найден' });
        else
            res.status(200).json(client);
    }
    catch (error) {
        console.log('Ошибка базы данных', error);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.getClient = getClient;
//Создание нового клиента в базе
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newClient = new client_model_1.Client(req.body);
        const saveClient = yield newClient.save();
        res.status(201).json(saveClient);
    }
    catch (error) {
        console.log('Ошибка базы данных', error);
        res.status(500).json({ message: 'Ошибка создания клиента' });
    }
});
exports.createClient = createClient;
//Удаление нового клиента в базе
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('deleteClient', req.params.id);
        const deletedClient = yield client_model_1.Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            res.status(404).json({ message: "Клиент не найден" });
        }
        res.status(204).json({ message: "Клиент удален" });
    }
    catch (error) {
        console.log('Ошибка базы данных', error);
        res.status(500).json({ message: 'Ошибка сервера. попробуйте позже' });
    }
});
exports.deleteClient = deleteClient;
//Обновление клиента в базе
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedClient = yield client_model_1.Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!exports.updateClient) {
            res.status(404).json({ message: "Клиент не найден" });
        }
        res.status(200).json(exports.updateClient);
        console.log("UpdateClient");
    }
    catch (error) {
        console.log('Ошибка обновления клиента', error);
        res.status(500).json({ message: 'Ошибка обновления клиента' });
    }
});
exports.updateClient = updateClient;
