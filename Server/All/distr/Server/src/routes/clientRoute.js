"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoute = void 0;
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
exports.clientRoute = express_1.default.Router();
exports.clientRoute.get('/', clientController_1.getClients);
exports.clientRoute.post('/', clientController_1.createClient);
exports.clientRoute.get('/:id', clientController_1.getClient);
exports.clientRoute.put('/:id', clientController_1.updateClient);
exports.clientRoute.delete('/:id', clientController_1.deleteClient);
