"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = void 0;
const mongoose_1 = require("mongoose");
const GroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
});
exports.GroupModel = (0, mongoose_1.model)('Group', GroupSchema, 'Group');
