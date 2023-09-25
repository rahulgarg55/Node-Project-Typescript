import { model, Schema } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import User from './User';

export const DOCUMENT_NAME = 'Attendance';
export const COLLECTION_NAME = 'Attendance';

export default interface Attendance extends CommonFields {
    user: User;
    date?: Date;
    clock_in?: Date;
    clock_out?: Date;
    work_from: string;
    leave_type: string;
    on_leave: boolean;
    unpaid: boolean;
}

export enum WorkFrom {
    HOME = "Home",
    OFFICE = "Office"
}

export enum LeaveType {
    NONE = "",
    FULL_DAY = "Full Day",
    HALF_DAY = "Half Day",
    SICK = "Sick",
    URGENT = "Urgent"
}

const schema = extend(CommonFieldsSchema,
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now()
        },
        clock_in: {
            type: Date,
            required: true,
            default: Date.now()
        },
        clock_out: {
            type: Date,
            required: true,
            default: Date.now()
        },
        work_from: {
            type: Schema.Types.String,
            enum: WorkFrom,
            default: WorkFrom.OFFICE
        },
        leave_type: {
            type: Schema.Types.String,
            enum: LeaveType,
            default: LeaveType.FULL_DAY
        },
        on_leave: {
            type: Schema.Types.Boolean,
            default: false,
        },
        unpaid: {
            type: Schema.Types.Boolean,
            default: false,
        },

    },
);

export const AttendanceModel = model<Attendance>(DOCUMENT_NAME, schema, COLLECTION_NAME);
