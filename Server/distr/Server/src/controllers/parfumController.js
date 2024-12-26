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
exports.deleteParfums = exports.updateParfums = exports.createParfum = exports.getParfums = exports.getParfum = void 0;
const product_model_1 = require("../models/product.model");
const file_1 = require("../utils/file");
const getParfum = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.getParfum = getParfum;
const getParfums = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parfums = yield product_model_1.Parfum.find();
            res.status(200).json(parfums);
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.getParfums = getParfums;
const createParfum = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newParfum = new product_model_1.Parfum(req.body);
            yield newParfum.save();
            res.status(201).json(newParfum);
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.createParfum = createParfum;
const updateParfums = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(`Вход в update, ${id}`);
            const result = yield product_model_1.Parfum.findByIdAndUpdate(id, req.body, { new: true });
            if (result)
                res.status(200).json(`Элемент с id=${id} обновлен!`);
            else
                res.status(404).json(`Элемент с id=${id} не найден`);
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.updateParfums = updateParfums;
const deleteParfums = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(`Вход в delete, ${id}`);
            const result = yield product_model_1.Parfum.findById(id);
            if (result) {
                (0, file_1.deleteFile)(result.pathOriginImageBottle);
                (0, file_1.deleteFile)(result.pathEssenceImageBottle);
                yield result.deleteOne();
                res.status(200).json(`Элемент с id=${id} удален!`);
            }
            else
                res.status(404).json(`Элемент с id=${id} не найден`);
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.deleteParfums = deleteParfums;
