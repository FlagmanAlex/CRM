import { Schema, model, Document } from 'mongoose';
import { IBrand } from '../../../../../Interfaces/IBrand';

interface Brand extends Omit<IBrand, '_id'>, Document { }

const BrandSchema = new Schema<Brand>({
    name: { type: String, required: true, trim: true }
});

export const BrandModel = model<Brand>('Brand', BrandSchema, 'Brand')