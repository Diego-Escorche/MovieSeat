import { validateUser, validatePartialUser } from '../schemas/userSchema';

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  login = async (req, res) => {
    const { email, username, password } = req.body;
    const user = await this.userModel.login({ email, username, password });
    if (user) return res.json(user);

    res.status(404).json({ message: 'User not found' });
  };

  register = async (req, res) => {
    const user = req.body;
    const validation = validateUser(user);
    if (!validation.success) return res.status(400).json(validation.error);

    const newUser = await this.userModel.register(user);
    res.json(newUser);
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const deletedUser = await this.userModel.delete(id);
    if (deletedUser) return res.json(deletedUser);

    res.status(404).json({ message: 'User not found' });
  };
}
