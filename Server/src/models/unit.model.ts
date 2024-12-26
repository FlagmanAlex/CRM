import mongoose from 'mongoose'
const UnitSchema = new mongoose.Schema({
    article: {type: String},
    brand: {type: String},
    positionNameRUS: {type: String},
    positionNameENG: {type: String},
    SEO: {type: String},
    dose: {type: String},
    unit: {type: String},
    structureType: {type: String}
})
export const Unit = mongoose.model('Unit', UnitSchema, 'Unit')