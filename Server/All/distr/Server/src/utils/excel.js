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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readExcelRangeToJSon = exports.readExcelTableToJson = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
function colToInt(col) {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
        result *= 26;
        result += col.charCodeAt(i) - 64;
    }
    return result;
}
const readExcelTableToJson = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileName, sheetName, tableName, fieldsName }) {
    var _b;
    const workbook = new exceljs_1.default.Workbook();
    yield workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet)
        throw new Error(`❌ Лист "${sheetName}" не найден`);
    const table = worksheet.getTable(tableName);
    if (!table)
        throw new Error(`❌ Таблица "${tableName}" не найдена`);
    const rawRef = (_b = table.table) === null || _b === void 0 ? void 0 : _b.tableRef;
    if (!rawRef || typeof rawRef !== 'string') {
        console.error('⚠️ ref отсутствует. Дамп таблицы:', JSON.stringify(table, null, 2));
        throw new Error(`❌ Таблица "${tableName}" не содержит допустимого ref`);
    }
    const match = rawRef.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match)
        throw new Error(`⛔ Неверный формат ref: ${rawRef}`);
    const [, colStart, rowStartStr, colEnd, rowEndStr] = match;
    const rowStart = parseInt(rowStartStr);
    const rowEnd = parseInt(rowEndStr);
    const startColIdx = colToInt(colStart);
    const endColIdx = colToInt(colEnd);
    const headerRow = worksheet.getRow(rowStart);
    if (!Array.isArray(headerRow.values)) {
        throw new Error('❌ Невозможно прочитать заголовки: headerRow.values не массив');
    }
    const headers = headerRow.values.slice(startColIdx, endColIdx + 1);
    // Фильтрация заголовков по переданным полям
    const filteredHeaders = fieldsName && fieldsName.length > 0
        ? headers.filter(header => fieldsName.includes(header))
        : headers;
    if (filteredHeaders.length === 0) {
        throw new Error('❌ Ни одно из переданных полей не найдено в таблице');
    }
    const result = [];
    for (let i = rowStart + 1; i <= rowEnd; i++) {
        const row = worksheet.getRow(i);
        const item = {};
        filteredHeaders.forEach((header, idx) => {
            const colIndex = headers.indexOf(header) + startColIdx; // Находим индекс столбца
            const cell = row.getCell(colIndex);
            const value = cell.value;
            if (value != null) {
                item[header] = value;
            }
        });
        result.push(item);
    }
    return result;
});
exports.readExcelTableToJson = readExcelTableToJson;
const readExcelRangeToJSon = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileName, sheetName, fieldsName, range }) {
    const workbook = new exceljs_1.default.Workbook();
    yield workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet)
        throw new Error(`❌ Лист "${sheetName}" не найден`);
    // Проверяем, что диапазон указан корректно
    const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (!match)
        throw new Error(`⛔ Неверный формат диапазона: ${range}`);
    const [, colStart, rowStartStr, colEnd, rowEndStr] = match;
    const rowStart = parseInt(rowStartStr);
    const rowEnd = parseInt(rowEndStr);
    const startColIdx = colToInt(colStart);
    const endColIdx = colToInt(colEnd);
    const headerRow = worksheet.getRow(rowStart);
    if (!Array.isArray(headerRow.values)) {
        throw new Error('❌ Невозможно прочитать заголовки: headerRow.values не массив');
    }
    const headers = headerRow.values.slice(startColIdx, endColIdx + 1);
    // Фильтрация заголовков по переданным полям
    const filteredHeaders = fieldsName && fieldsName.length > 0
        ? headers.filter(header => fieldsName.includes(header))
        : headers;
    if (filteredHeaders.length === 0) {
        throw new Error('❌ Ни одно из переданных полей не найдено в диапазоне');
    }
    const result = [];
    for (let i = rowStart + 1; i <= rowEnd; i++) {
        const row = worksheet.getRow(i);
        const item = {};
        filteredHeaders.forEach((header, idx) => {
            const colIndex = headers.indexOf(header) + startColIdx; // Находим индекс столбца
            const cell = row.getCell(colIndex);
            const value = cell.value;
            if (value != null) {
                item[header] = value;
            }
        });
        result.push(item);
    }
    return result;
});
exports.readExcelRangeToJSon = readExcelRangeToJSon;
