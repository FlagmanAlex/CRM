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
exports.checkAuth = void 0;
const user_model_1 = require("../models/user.model");
const checkAuth = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = req.query.hash;
        try {
            const user = yield user_model_1.User.findOne({
                loginHistory: {
                    $elemMatch: { hash: hash }
                }
            });
            if (user) {
                res.status(200).json({
                    exist: true,
                    user_id: user.user_id,
                    roles: user.roles
                });
            }
            else {
                res.status(404).json({
                    exist: false,
                    error: 'Такого пользователя нет в базе'
                });
            }
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.checkAuth = checkAuth;
