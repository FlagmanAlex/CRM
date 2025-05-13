import { Schema, model, Document } from 'mongoose';
import { IGroup } from '../../../../Interfaces/IGroup';

interface Group extends Omit<IGroup, '_id'>, Document { }

const GroupSchema = new Schema<Group>({
    name: { type: String, required: true, trim: true },
});

export const GroupModel = model<Group>('Group', GroupSchema, 'Group');

