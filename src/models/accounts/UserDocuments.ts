import { model, Schema } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import User from './User';

export const DOCUMENT_NAME = 'UserDocuments';
export const COLLECTION_NAME = 'UserDocuments';

export default interface UserDocuments extends CommonFields {
    user: User;
    photo: string;
    joining_letter: string;
    relieving: string;
    salary_slip_1: string;
    salary_slip_2: string;
    salary_slip_3: string;
    appraisal: string;
    permanent_address: string;
    local_address: string;
    pan_card: string;
    metric_grade: string;
    senior_secondary: string;
    graduation: string;
    post_graduation: string;
}

const schema = extend(CommonFieldsSchema,
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        photo: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        joining_letter: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        relieving: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        salary_slip_1: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        salary_slip_2: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        salary_slip_3: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        appraisal: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        permanent_address: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        local_address: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        pan_card: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        metric_grade: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        senior_secondary: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        graduation: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },
        post_graduation: {
            type: Schema.Types.String,
            maxlength: 200,
            trim: true,
            default: ""
        },

    },
);

export const UserDocumentsModel = model<UserDocuments>(DOCUMENT_NAME, schema, COLLECTION_NAME);
