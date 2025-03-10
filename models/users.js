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

  static async update({ id, user }) {
    return await User.findByIdAndUpdate({ _id: id }, user, { new: true });
  }

  static async delete({ id }) {
    await User.findByIdAndDelete({ _id: id });
    const deletedUser = await User.findById({ _id: id });
    return deletedUser ? false : true;
  }
}
