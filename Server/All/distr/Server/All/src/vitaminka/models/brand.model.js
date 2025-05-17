"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandModel = void 0;
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true }
});
exports.BrandModel = (0, mongoose_1.model)('Brand', BrandSchema, 'Brand');
