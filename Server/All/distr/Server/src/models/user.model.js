"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const loginSchema = new mongoose_1.default.Schema({
    hash: { type: String, require: true },
    date: { type: Date, default: Date.now },
});
const UserSchema = new mongoose_1.default.Schema({
    user_id: { type: String },
    chat_id: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    phone: { type: String },
    address: { type: String },
    gps: { type: String },
    percent: { type: Number, default: 15 },
    description: { type: String },
    roles: { type: String, default: 'USER' },
    loginHistory: [loginSchema]
});
exports.User = mongoose_1.default.model('User', UserSchema, 'User');
