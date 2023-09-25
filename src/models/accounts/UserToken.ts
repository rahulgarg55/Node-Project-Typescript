import { model, Schema, Document } from 'mongoose';
import CommonFields, { CommonFieldsSchema, extend } from '../app/CommonFields';
import User from './User';

export const DOCUMENT_NAME = 'UserToken';
export const COLLECTION_NAME = 'Usertokens';

export default interface UserToken extends CommonFields {
  user: User[];
  access_token?: string;
  expires_in?: number;
  create_date?: Date;
  modify_date?: Date;
}

const schema = extend(CommonFieldsSchema,
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      access_token: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
        select: false,
      },
      expires_in: {
        type: Schema.Types.Number,
        select: false,
      },
    },
  );
  
  export const UserTokenModel = model<UserToken>(DOCUMENT_NAME, schema, COLLECTION_NAME);
  