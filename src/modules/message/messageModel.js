import { Schema, model } from 'mongoose';

export class MessageSchema extends Schema {
  constructor() {
    super(
      {
        author: { type: Schema.Types.ObjectId, ref: 'User' },

        content: { type: String },

        type: { type: String },

      },
      {
        toJSON: {
          transform(_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
          },
        },

        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
      }
    );
  }
}

export const messageSchema = new MessageSchema();

export const Message = model('Message', messageSchema);
