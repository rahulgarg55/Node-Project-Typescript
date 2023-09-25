import { model, Schema } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import User from './User';

export const DOCUMENT_NAME = 'Appraisal';
export const COLLECTION_NAME = 'Appraisal';

export default interface Appraisal extends CommonFields {
    user: User;
    due_date?: Date;
    increment_grade: string;
    feedback: string;
    behavioural_record: string;
    increment_percentage: number;
    amount_incremented: number;
    revised_salary: number;
    applicable_date?: Date;
}

export enum IncGrade {
    NONE = "",
    MINIMAL = "Minimal",
    MODERATE = "Moderate",
    EXCELLENCE = "Excellence"
}

const schema = extend(CommonFieldsSchema,
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        due_date: {
            type: Date,
            required: true,
            default: Date.now()
        },
        increment_grade: {
            type: Schema.Types.String,
            enum: IncGrade,
            default: IncGrade.NONE
        },
        feedback: {
            type: Schema.Types.String,
            trim: true,
            maxlength: 1000,
        },
        behavioural_record: {
            type: Schema.Types.String,
            trim: true,
            maxlength: 1000,
        },
        increment_percentage: {
            type: Schema.Types.Number,
            default: 0
        },
        amount_incremented: {
            type: Schema.Types.Number,
            default: 0
        },
        revised_salary: {
            type: Schema.Types.Number,
            default: 0
        },
        applicable_date: {
            type: Date,
            required: true,
            default: Date.now()
        },

    },
);

export const AppraisalModel = model<Appraisal>(DOCUMENT_NAME, schema, COLLECTION_NAME);
