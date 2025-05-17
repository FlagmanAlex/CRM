"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parfumController_1 = require("../controllers/parfumController");
const router = express_1.default.Router();
router.post('/create', parfumController_1.createParfum);
router.put('/:id', parfumController_1.updateParfums);
router.delete('/:id', parfumController_1.deleteParfums);
router.get('/', parfumController_1.getParfums);
router.get('/:id', parfumController_1.getParfum);
exports.default = router;
