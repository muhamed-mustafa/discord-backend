import { Schema, model } from 'mongoose';

export class ConversationSchema extends Schema {
  constructor() {
    super(
      {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],

        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
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

export const conversationSchema = new ConversationSchema();

export const Conversation = model('Conversation', conversationSchema);
