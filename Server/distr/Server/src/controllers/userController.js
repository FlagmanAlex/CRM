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
exports.checkAuth = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = exports.getUser = void 0;
const user_model_1 = require("../models/user.model");
const getUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user_id = req.params.id;
            const user = yield user_model_1.User.find({ user_id: user_id });
            console.log(user_id);
            res.status(200).json(user);
        }
        catch (error) {
            if (error)
                res.status(400).json(error.message);
        }
    });
};
exports.getUser = getUser;
const getUsers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_model_1.User.find();
            res.status(200).json(users);
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.getUsers = getUsers;
const createUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.body.user_id;
            const result = yield user_model_1.User.findOneAndUpdate({ user_id: id }, req.body, { new: true });
            if (result)
                res.status(200).json(result);
            else {
                const newUser = new user_model_1.User(req.body);
                yield newUser.save();
                res.status(201).json(newUser);
            }
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.createUser = createUser;
const updateUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(`Вход в update, ${id}`);
            const result = yield user_model_1.User.findByIdAndUpdate(id, req.body, { new: true });
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
exports.updateUser = updateUser;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            console.log(`Вход в delete, ${id}`);
            const result = yield user_model_1.User.findById(id);
            if (result) {
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
exports.deleteUser = deleteUser;
const checkAuth = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = req.query.hash;
        console.log(hash);
        try {
            const user = yield user_model_1.User.findOne({ hash });
            if (user) {
                console.log(user.user_id);
                res.status(200).json({ userId: user.user_id });
            }
            else {
                res.status(404).json({ error: 'User not faund' });
            }
        }
        catch (error) {
            res.status(400).json(error.message);
        }
    });
};
exports.checkAuth = checkAuth;
