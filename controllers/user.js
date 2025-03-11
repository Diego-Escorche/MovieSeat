import { validateUser, validatePartialUser } from '../schemas/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import JWT_SECRET from '../.env';
import { asyncHandler } from '../utils.js';

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns The user with a signed JWT Token in a cookie.
   */
  login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const user = await this.userModel.login({ email, username, password });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Checks the password with the one stored on the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Invalid password' });

    // Creates a JWT Token with the users id and the secret to sign it.
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    // Then it stores it in a cookie.
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json(user);
  });

  /**
   * Creates a new user and logs it in.
   * @param {*} req
   * @param {*} res
   * @returns The new user that has been created.
   */
  register = asyncHandler(async (req, res) => {
    const user = req.body;
    const validation = validateUser(user);
    if (!validation.success) return res.status(400).json(validation.error);

    // The password will be encrypted for security reasons.
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userModel.register({
      ...user,
      password: hashedPassword,
    });

    req.body = {
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
    };

    // Calls the login method to immediately log in the user after registering.
    this.login(req, res);
  });

  /**
   * Delete an user after authenticating it.
   * @param {*} req
   * @param {*} res
   * @returns A message that the user has been deleted successfully.
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await this.userModel.delete(id);
    if (deletedUser === true)
      return res.json({ message: 'User deleted succesfully' });

    res.status(404).json({ message: 'User not found' });
  });

  update = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { updates } = req.body;
    const check = validatePartialUser(updates);
    if (!check.success) return res.status(400).json(check.error);

    const updatedUser = await this.userModel.update({
      id: userId,
      user: updates,
    });

    if (updatedUser) return res.json(updatedUser);

    res.status(404).json({ message: 'User not found' });
  });

  /**
   * Promotes a user to an admin role.
   * @param {*} req
   * @param {*} res
   * @returns The updated user with admin role.
   */
  promoteToAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const updatedUser = await this.userModel.update({
      id: userId,
      user: { role: ['admin'] },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  });

  logout = asyncHandler((req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'User has logged out succesfully' });
  });
}
