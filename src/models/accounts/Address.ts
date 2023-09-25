import { model, Schema } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import Country from '../app/Country';
import State from '../app/State';
import User from './User';

export const DOCUMENT_NAME = 'Address';
export const COLLECTION_NAME = 'Addresses';


export default interface Address extends CommonFields {
  user: User[],
  address: string,
  pincode: number,
  country: Country[];
  state: State[];
  city: string;
}

const schema = extend(CommonFieldsSchema,
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
      address: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 1000,
      },
      pincode: {
        type: Schema.Types.Number,
        required: true,
      },
      country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
      },
      state: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: true,
      },
      city: {
        type: Schema.Types.String,
        maxlength: 100,
        required: true,
      },
    },
  );
  
  export const AddressModel = model<Address>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  