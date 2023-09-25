import { model, Schema, } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from './CommonFields';

export const DOCUMENT_NAME = 'Countries';
export const COLLECTION_NAME = 'Countries';

export default interface Country extends CommonFields {
  name: string;
  code: string;
}

const schema = extend(CommonFieldsSchema,
    {
      name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      code: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 50,
      },
    },
  );
  
  export const CountryModel = model<Country>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  