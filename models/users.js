import { randomUUID } from 'crypto';
import { User } from './mongodb/DBBroker';

export class UserModel {
  static async login({ email, username }) {
    const user = await User.findOne({ email });
    // If a user was not found by email, it'll try to find it by username
    if (!user) {
      user = await User.findOne({ username });
    }

    return user;
  }

  static async register({ user }) {
    const newUser = new User({
      _id: randomUUID(),
      ...user,
    });

    await newUser.save();
    return newUser;
  }

  static async delete({ id }) {
    return User.findByIdAndDelete({ _id: id });
  }
}
