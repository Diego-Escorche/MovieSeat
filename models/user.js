import { randomUUID } from 'crypto';
import { User } from './mongodb/DBBroker.js';

export class UserModel {
  /**
   * Looks for a user by its email or username
   * @param {*} param0 Object that contains the email or username
   * @returns The user if it exists, otherwise null
   */
  static async login({ email, username }) {
    let user = await User.findOne({ email: email });
    // If a user was not found by email, it'll try to find it by username
    if (!user) {
      user = await User.findOne({ username: username });
    }

    return user;
  }

  /**
   * Stores a user in the database and creates an id.
   * @param {*} param0 Object that contains the user data.
   * @returns The user object if it was created, otherwise null.
   */
  static async register({ input }) {
    const newUser = new User({
      _id: randomUUID(),
      ...input,
    });

    await newUser.save();
    return newUser;
  }

  /**
   * Searches for a user by its id and updates it with the input data.
   * @param {*} param0 Object that contains the user id and the new data.
   * @returns The updated user if it exists, otherwise null.
   */
  static async update({ id, input }) {
    return await User.findByIdAndUpdate({ _id: id }, input, {
      new: true,
    }).catch((err) => console.log(err));
  }

  static async delete({ id }) {
    return await User.findByIdAndDelete({ _id: id }).catch((err) => {
      console.log(err);
    });
  }

  static async findById({ id }) {
    const user = await User.findById(id).lean();
    if (!user) return null;

    const { password, ...safeUser } = user; // strip sensitive fields
    return safeUser;
  }
}
