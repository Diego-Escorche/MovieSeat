import { randomUUID } from 'crypto';
import { User } from '../models/user.js';
import { IUser } from '../interfaces/user.js';
import { Document } from 'mongoose';

type UserDocument = Document<unknown, {}, IUser> & IUser;

type SafeUser = Omit<IUser, 'password'>;

export class UserModel {
  /**
   * Finds a user by email or username.
   * @returns The found user document or null.
   */
  static async login({
    email,
    username,
  }: {
    email?: string;
    username?: string;
  }): Promise<UserDocument | null> {
    let user = email ? await User.findOne({ email }) : null;
    if (!user && username) {
      user = await User.findOne({ username });
    }
    return user;
  }

  /**
   * Registers a new user with a UUID as their _id.
   */
  static async register({
    input,
  }: {
    input: Omit<IUser, '_id'>;
  }): Promise<UserDocument> {
    const newUser = new User({
      _id: randomUUID(),
      ...input,
    });
    await newUser.save();
    return newUser;
  }

  /**
   * Updates a user by their ID.
   */
  static async update({
    id,
    input,
  }: {
    id: string;
    input: Partial<IUser>;
  }): Promise<UserDocument | null> {
    return await User.findByIdAndUpdate(id, input, {
      new: true,
    }).catch((err) => {
      console.log(err);
      return null;
    });
  }

  /**
   * Deletes a user by their ID.
   */
  static async delete({ id }: { id: string }): Promise<UserDocument | null> {
    return await User.findByIdAndDelete(id).catch((err) => {
      console.log(err);
      return null;
    });
  }

  /**
   * Finds a user by ID and returns a safe version without the password.
   */
  static async findById(id: string): Promise<SafeUser | null> {
    const user = await User.findById(id).lean();
    if (!user) return null;

    const { password, ...safeUser } = user as IUser;
    return safeUser;
  }
}
