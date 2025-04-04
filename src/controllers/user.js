/**
 * @fileoverview
 * UserController handles all user-related operations, including:
 * - Authentication (login/logout)
 * - Registration
 * - Profile update
 * - User deletion
 * - Role management
 *
 * It uses JWT for authentication and bcrypt for password encryption.
 * User validation is handled using Zod schemas.
 */

import { validateUser, validatePartialUser } from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { asyncHandler } from '../utils.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

export class UserController {
  /**
   * Authenticates a user with email/username and password.
   * Issues a signed JWT token stored in an HTTP-only cookie.
   */
  login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = await this.userModel.login({ email, username, password });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.json(user);
  });

  /**
   * Registers a new user after validating and hashing their password.
   * Automatically logs in the user upon successful registration.
   */
  register = asyncHandler(async (req, res) => {
    const result = validateUser(req.body);
    if (result.error)
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });

    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    const newUser = await this.userModel.register({
      input: {
        ...result.data,
        password: hashedPassword,
      },
    });

    if (!newUser)
      return res.status(400).json({ message: 'Error creating user' });

    req.body = {
      email: newUser.email,
      username: newUser.username,
      password: result.data.password,
      role: newUser.role,
    };

    this.login(req, res);
  });

  /**
   * Updates user information such as email or password.
   * Password is hashed before saving if provided.
   */
  update = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const check = validatePartialUser(req.body);

    if (check.error)
      return res.status(400).json({ message: JSON.parse(check.error.message) });

    let password;
    if (check.data.password)
      password = await bcrypt.hash(check.data.password, 10);

    const updatedUser = await this.userModel.update({
      id: userId,
      input: {
        ...(check.data.email && { email: check.data.email }),
        ...(password && { password: password }),
      },
    });

    if (updatedUser) return res.json(updatedUser);

    res.status(404).json({ message: 'User not found' });
  });

  /**
   * Deletes a user account based on their ID.
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await this.userModel.delete(id);
    if (deletedUser) return res.json({ message: 'User deleted succesfully' });

    res.status(404).json({ message: 'User not found' });
  });

  /**
   * Assigns admin role to a user.
   */
  promoteToAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const updatedUser = await this.userModel.update({
      id: userId,
      input: { role: ['admin'] },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  });

  /**
   * Logs out the current user by clearing the access token cookie.
   */
  logout = asyncHandler(async (req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'User has logged out succesfully' });
  });
}
