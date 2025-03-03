import { validateUser } from '../schemas/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import JWT_SECRET from '../.env';

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
  login = async (req, res) => {
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
    res.json({ message: 'Login successful' });
  };

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns The new user that has been created.
   */
  register = async (req, res) => {
    const user = req.body;
    const validation = validateUser(user);
    if (!validation.success) return res.status(400).json(validation.error);

    // The password will be encrypted for security reasons.
    const hashedPassword = await bcrypt.hast(user.password, 10);
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

    // Calls the login method to inmeadiately log in the user after registering.
    this.login(req, res);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await this.userModel.delete(id);
    if (deletedUser) return res.json(deletedUser);

    res.status(404).json({ message: 'User not found' });
  };

  logout = (req, res) => {
    res.clearCookie('access_token');
    res.json({ message: 'User has logged out succesfully' });
  };
}
