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
exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnits = exports.getUnit = void 0;
const unit_model_1 = require("../models/unit.model");
const getUnit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.getUnit = getUnit;
const getUnits = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.getUnits = getUnits;
const createUnit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUnit = new unit_model_1.Unit(req.body);
            yield newUnit.save();
            res.status(201).json(newUnit);
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Ошибка создания Unit' });
        }
    });
};
exports.createUnit = createUnit;
const updateUnit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.updateUnit = updateUnit;
const deleteUnit = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
};
exports.deleteUnit = deleteUnit;
