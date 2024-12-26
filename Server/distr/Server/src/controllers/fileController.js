"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.upl = void 0;
const file_1 = require("../utils/file");
// Загрузка файла
const upl = (req, res) => {
    var _a;
    res.status(200).json({ imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename });
};
exports.upl = upl;
const del = (req, res) => {
    const { fileName } = req.params;
    (0, file_1.deleteFile)(fileName);
    res.status(200).json('Фалй удален');
};
exports.del = del;
