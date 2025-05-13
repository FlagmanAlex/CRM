"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UnitSchema = new mongoose_1.default.Schema({
    article: { type: String },
    brand: { type: String },
    positionNameRUS: { type: String },
    positionNameENG: { type: String },
    SEO: { type: String },
    dose: { type: String },
    unit: { type: String },
    structureType: { type: String }
});
exports.Unit = mongoose_1.default.model('Unit', UnitSchema, 'Unit');
