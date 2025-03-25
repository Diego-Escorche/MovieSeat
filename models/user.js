/**
 * @fileoverview
 * UserModel provides static methods to interact with the User collection in MongoDB.
 * It handles user authentication, creation, updates, deletion, and safe lookup by ID.
 * Password handling should be done outside this model to ensure security and flexibility.
 */

import { randomUUID } from 'crypto';
import { User } from './mongodb/DBBroker.js';

export class UserModel {
  /**
   * Finds a user by email or username.
   * Attempts email lookup first, then falls back to username.
   *
   * @param {Object} param0 - Object containing `email` or `username`.
   * @returns {Promise<Object|null>} The found user document or null.
   */
  static async login({ email, username }) {
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.findOne({ username: username });
    }
    return user;
  }

  /**
   * Registers a new user with a UUID as their _id.
   *
   * @param {Object} param0 - Object with `input` data (validated user data).
   * @returns {Promise<Object|null>} The newly created user.
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
   * Updates a user by their ID.
   *
   * @param {Object} param0 - Contains `id` (user ID) and `input` (fields to update).
   * @returns {Promise<Object|null>} The updated user, or null if not found.
   */
  static async update({ id, input }) {
    return await User.findByIdAndUpdate(id, input, {
      new: true,
    }).catch((err) => console.log(err));
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {Object} param0 - Object with the `id` of the user.
   * @returns {Promise<Object|null>} The deleted user or null if not found.
   */
  static async delete({ id }) {
    return await User.findByIdAndDelete(id).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Finds a user by ID and returns a safe version without the password.
   *
   * @param {string} id - The user ID to look up.
   * @returns {Promise<Object|null>} The user object without password, or null.
   */
  static async findById(id) {
    const user = await User.findById(id).lean();
    if (!user) return null;

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
