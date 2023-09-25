import { model, Schema, } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from './CommonFields';

export const DOCUMENT_NAME = 'EmployeeType';
export const COLLECTION_NAME = 'Employee Types';

export default interface EmployeeType extends CommonFields {
  name: string;
}

const schema = extend(CommonFieldsSchema,
    {  
      name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },
  );
  
  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
 });

  export const EmployeeTypeModel = model<EmployeeType>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  