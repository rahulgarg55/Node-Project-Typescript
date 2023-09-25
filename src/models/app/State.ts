import { model, Schema, } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from './CommonFields';
import Country from './Country';

export const DOCUMENT_NAME = 'States';
export const COLLECTION_NAME = 'States';

export default interface State extends CommonFields {
  state: string;
  districts: Array<string>;
  country: Country[];
}

const schema = extend(CommonFieldsSchema,
    {
      state: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      districts: {
        type: Schema.Types.Array,
        required: true,
        trim: true,
        maxlength: 50,
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        select: false,
      },
    },
  );
  
  export const StateModel = model<State>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  