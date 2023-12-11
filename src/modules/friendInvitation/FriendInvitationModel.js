import { Schema, model } from 'mongoose';

export class FriendInvitationSchema extends Schema {
  constructor() {
    super(
      {
        receiver: { type: Schema.Types.ObjectId, ref: 'User' },

        sender: { type: Schema.Types.ObjectId, ref: 'User' },
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

export const friendInvitationSchema = new FriendInvitationSchema();

export const FriendInvitation = model('FriendInvitation', friendInvitationSchema);
