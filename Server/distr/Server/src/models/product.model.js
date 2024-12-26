"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vitamin = exports.Parfum = exports.Product = exports.Price = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//---------------------------------------------
const priceSchema = new mongoose_1.default.Schema({
    productId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number },
    date: { type: Date, default: Date.now }
});
exports.Price = mongoose_1.default.model('Price', priceSchema, 'Price');
//---------------------------------------------
const ProductSchema = new mongoose_1.default.Schema({
    nameRus: { type: String }, //Наименование продукта на русском
    nameEng: { type: String }, //Наиенование продукта на Английском
    nameShot: { type: String }, //Краткое наименование 
    status: { type: String }, //Наличие, под заказ и т. д.
    description: { type: String }, //Описание продукта
    productType: { type: String, required: true }
}, {
    discriminatorKey: 'productType',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.Product = mongoose_1.default.model('Product', ProductSchema, 'Product');
//Виртуальное поле цены
ProductSchema.virtual('currentPrice', {
    ref: 'Price',
    localField: '_id',
    foreignField: 'productId',
    justOne: true,
    options: { sort: { date: -1 } }
});
//---------------------------------------------
const ParfumSchema = new mongoose_1.default.Schema({
    fullArticle: { type: String },
    smallArticle: { type: String },
    originFor: { type: String },
    imageLogo: { type: String },
    pathOriginImageBottle: { type: String },
    pathEssenceImageBottle: { type: String },
    parfumesFor: { type: String },
    topNotes: { type: String },
    heartNotes: { type: String },
    baseNotes: { type: String },
    smell: { type: String },
});
exports.Parfum = exports.Product.discriminator('Parfum', ParfumSchema, 'Parfum');
//---------------------------------------------
const VitaminSchema = new mongoose_1.default.Schema({
    article: { type: String },
    brand: { type: String },
    positionNameRUS: { type: String },
    positionNameENG: { type: String },
    SEO: { type: String },
    dose: { type: String },
    unit: { type: String },
    structureType: { type: String }
});
exports.Vitamin = exports.Product.discriminator('Vitamin', VitaminSchema, 'Vitamin');
