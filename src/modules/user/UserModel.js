import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserSchema extends Schema {
  constructor() {
    super(
      {
        username: {
          type: String,
          required: true,
        },

        email: {
          type: String,
          required: true,
        },

        password: {
          type: String,
          required: true,
        },

        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

    this.pre('save', this.hashPassword);

    this.methods.comparePassword = async function (enteredPassword) {
      return bcrypt.compare(enteredPassword, this.password);
    };

    this.methods.getSignedJwtToken = function (email) {
      return jwt.sign({ userId: this.id, email }, process.env.JWT_TOKEN, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });
    };
  }

  hashPassword = async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password, salt);

    next();
  };
}

export const userSchema = new UserSchema();

export const User = model('User', userSchema);
