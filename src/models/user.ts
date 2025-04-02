import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../interfaces/user.js';

const userSchema = new Schema<IUser>({
  _id: String,
  username: String,
  email: String,
  password: String,
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
