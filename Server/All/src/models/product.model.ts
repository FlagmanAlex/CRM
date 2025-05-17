import mongoose from 'mongoose'
import { IParfum } from '../../../../Interfaces/IProduct'

interface IParfumModel extends Omit<IParfum, "_id">, mongoose.Document { }
//---------------------------------------------

const priceSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number },
    date: { type: Date, default: Date.now }
})

export const Price = mongoose.model('Price', priceSchema, 'Price')

//---------------------------------------------

const ProductSchema = new mongoose.Schema({
    nameRus: { type: String },   //Наименование продукта на русском
    nameEng: { type: String },   //Наиенование продукта на Английском
    nameShot: { type: String },  //Краткое наименование 
    status: { type: String },     //Наличие, под заказ и т. д.
    description: { type: String },//Описание продукта
    productType: { type: String, required: true }
},
    {
        discriminatorKey: 'productType',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

export const Product = mongoose.model('Product', ProductSchema, 'Product')

//Виртуальное поле цены
ProductSchema.virtual('currentPrice', {
    ref: 'Price',
    localField: '_id',
    foreignField: 'productId',
    justOne: true,
    options: { sort: { date: -1 } }
})

//---------------------------------------------

const ParfumSchema = new mongoose.Schema({
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

})
export const Parfum = Product.discriminator<IParfumModel>('Parfum', ParfumSchema, 'Parfum')

//---------------------------------------------

const VitaminSchema = new mongoose.Schema({
    article: { type: String },
    brand: { type: String },
    positionNameRUS: { type: String },
    positionNameENG: { type: String },
    SEO: { type: String },
    dose: { type: String },
    unit: { type: String },
    structureType: { type: String }
})
export const Vitamin = Product.discriminator('Vitamin', VitaminSchema, 'Vitamin')
