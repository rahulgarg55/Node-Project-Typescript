import { model, Schema, } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from './CommonFields';

export const DOCUMENT_NAME = 'Department';
export const COLLECTION_NAME = 'Departments';

export default interface Department extends CommonFields {
  name: string;
  description: string;
}

const schema = extend(CommonFieldsSchema,
    {
      name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      description: {
        type: Schema.Types.String,
        trim: true,
        maxlength: 500,
        default: "",
      },
    },
  );

  
  export const DepartmentModel = model<Department>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  