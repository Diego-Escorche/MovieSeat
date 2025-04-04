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

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { asyncHandler } from '../utils.js';
import { UserModel } from '../services/user.js';
import { validateUser, validatePartialUser } from '../schemas/userSchema.js';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const user = await this.userModel.login({ email, username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json(user);
  });

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = validateUser(req.body);
    if (result.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(result.error.message) });
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = await this.userModel.register({
      input: {
        ...result.data,
        password: hashedPassword,
      },
    });

    if (!newUser) {
      return res.status(400).json({ message: 'Error creating user' });
    }

    // Reuse login handler with modified request
    req.body = {
      email: newUser.email,
      username: newUser.username,
      password: result.data.password,
      role: newUser.role,
    };

    return this.login(req, res);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const check = validatePartialUser(req.body);

    if (check.error) {
      return res.status(400).json({ message: JSON.parse(check.error.message) });
    }

    let password: string | undefined;
    if (check.data.password) {
      password = await bcrypt.hash(check.data.password, 10);
    }

    const updatedUser = await this.userModel.update({
      id: userId,
      input: {
        ...(check.data.email && { email: check.data.email }),
        ...(password && { password }),
      },
    });

    if (updatedUser) return res.json(updatedUser);

    return res.status(404).json({ message: 'User not found' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedUser = await this.userModel.delete({ id });

    if (deletedUser) {
      return res.json({ message: 'User deleted successfully' });
    }

    return res.status(404).json({ message: 'User not found' });
  });

  promoteToAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const updatedUser = await this.userModel.update({
      id: userId,
      input: { role: ['admin'] },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.json({ message: 'User has logged out successfully' });
  });
}
