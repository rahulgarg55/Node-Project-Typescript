import { model, Schema, STATES } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import User from './User';

export const DOCUMENT_NAME = 'Salary';
export const COLLECTION_NAME = 'Salary';

export default interface Salary extends CommonFields {
    user: User;
    working_days: number;
    days_worked: number;
    paid_leaves: number;
    unpaid_leaves: number;
    ctc: number;
    basic_salary: number;
    hra: number;
    conveyance_allowance: number;
    medical_allowance: number;
    special_allowance: number;
    employer_epf: number;
    employer_esic: number;
    employee_epf: number;
    employee_esic: number;
    total: number;
    gross_salary: number;
    tds: number;
    security_deduction_percentage: number;
    security_deduction: number;
    other_deduction: number;
    total_deduction: number;
    adjustments_arrear: number;
    incentive_bonus: number;
    net_payble_salary: number;
    deposited: string;
    emf: string;
    status: string;
    
}

export enum YesNo {
   YES = "Yes",
   NO = "No"
}

export enum SalaryStatus {
    SUCCESS = "Success",
    PENDING = "Pending",
    FAILED = "Failed",
 }

const schema = extend(CommonFieldsSchema,
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        working_days: {
            type: Schema.Types.Number,
            default: 0
        },
        days_worked: {
            type: Schema.Types.Number,
            default: 0
        },
        paid_leaves: {
            type: Schema.Types.Number,
            default: 0
        },
        unpaid_leaves: {
            type: Schema.Types.Number,
            default: 0
        },
        ctc: {
            type: Schema.Types.Number,
            default: 0
        },
        basic_salary: {
            type: Schema.Types.Number,
            default: 0
        },
        hra: {
            type: Schema.Types.Number,
            default: 0
        },
        conveyance_allowance: {
            type: Schema.Types.Number,
            default: 0
        },
        medical_allowance: {
            type: Schema.Types.Number,
            default: 0
        },
        special_allowance: {
            type: Schema.Types.Number,
            default: 0
        },
        employer_epf: {
            type: Schema.Types.Number,
            default: 0
        },
        employer_esic: {
            type: Schema.Types.Number,
            default: 0
        },
        employee_epf: {
            type: Schema.Types.Number,
            default: 0
        },
        employee_esic: {
            type: Schema.Types.Number,
            default: 0
        },
        total: {
            type: Schema.Types.Number,
            default: 0
        },
        gross_salary: {
            type: Schema.Types.Number,
            default: 0
        },
        tds: {
            type: Schema.Types.Number,
            default: 0
        },
        security_deduction_percentage: {
            type: Schema.Types.Number,
            default: 0
        },
        security_deduction: {
            type: Schema.Types.Number,
            default: 0
        },
        other_deduction: {
            type: Schema.Types.Number,
            default: 0
        },
        total_deduction: {
            type: Schema.Types.Number,
            default: 0
        },
        adjustments_arrear: {
            type: Schema.Types.Number,
            default: 0
        },
        incentive_bonus: {
            type: Schema.Types.Number,
            default: 0
        },
        net_payble_salary: {
            type: Schema.Types.Number,
            default: 0
        },
        deposited: {
            type: Schema.Types.String,
            enum: YesNo,
            default: YesNo.NO
        },
        emf: {
            type: Schema.Types.String,
            enum: YesNo,
            default: YesNo.NO
        },
        status: {
            type: Schema.Types.String,
            enum: SalaryStatus,
            default: SalaryStatus.PENDING
        },

    },
);

export const SalaryModel = model<Salary>(DOCUMENT_NAME, schema, COLLECTION_NAME);
