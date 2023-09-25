import { Schema, Document } from 'mongoose';

export default interface CommonFields extends Document {
    is_deleted?: boolean;
    create_date?: Date;
    modify_date?: Date;
  }

const schema = new Schema(
    {
      is_deleted: {
        type: Schema.Types.Boolean,
        default: false,
      },
      create_date: {
        type: Date,
        required: true,
        default:  Date.now()
      },
      modify_date: {
        type: Date,
        required: false,
      },
    },
    {
      versionKey: false,
    },
  );
  
  export const CommonFieldsSchema = schema;
  

// Extend function
export const extend = (schema, obj) => {

  const new_schema = new Schema(
    Object.assign({}, schema.obj, obj)
  )

  return new_schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  };