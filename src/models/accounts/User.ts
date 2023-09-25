import { model, Schema, Document, Decimal128, Types, } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import Department from '../app/Department';
import EmployeeType from '../app/EmployeeType';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'Users';

// export enum EmployeeTypes {
//   SNWO = 'Salary/No OverTime',
//   SWO = 'Salary/Overtime',
//   PBH = 'Paid By Hour',
//   OD = 'Owners Draw'
// }

export enum SalaryPer {
  NONE = '',
  HOUR = 'Hour',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
}

export enum Orgs {
  ODZSERVICES = "odzservices",
  OURDESIGNZ = "Ourdesignz"
}

export default interface User extends CommonFields {
  first_name: string;
  last_name: string;
  email?: string;
  personal_email?: string;
  password?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  start_date?: Date;
  department: Department;
  manager: string;
  work_address?: string;
  job_title?: string;
  employee_type?: EmployeeType;
  salary?: number;
  salary_per?: string;
  mobile_number?: string;
}

const schema = extend(CommonFieldsSchema,
    {
      first_name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      last_name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
        select: true,
      },
      personal_email: {
        type: Schema.Types.String,
        trim: true,
        select: true,
      },
      password: {
        type: Schema.Types.String,
        select: false,
      },
      is_staff: {
        type: Schema.Types.Boolean,
        default: false,
      },
      is_superuser: {
        type: Schema.Types.Boolean,
        default: false,
      },
      start_date: {
        type: Date,
        required: false,
      },
      department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
      },
      manager: {
        type: Schema.Types.String,
        trim: true,
        maxlength: 100,
      },
      work_address: {
        type: Schema.Types.String,
        maxlength: 200,
      },
      job_title: {
        type: Schema.Types.String,
        maxlength: 150,
      },
      employee_type: {
        type: Schema.Types.ObjectId,
        ref: 'EmployeeType',
      },
      salary: {
        type: Schema.Types.Number,
        default: 0
      },
      salary_per: {
        type: Schema.Types.String,
        enum: SalaryPer,
        default: SalaryPer.NONE
      },
      mobile_number: {
        type: Schema.Types.String,
        trim: true,
        maxlength: 16,
      },
      organisation: {
        type: Schema.Types.String,
        enum: Orgs,
        default: Orgs.ODZSERVICES
      },
    },
  );
  
  export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  