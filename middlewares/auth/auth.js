import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 * Method that authenticates that the user is logged in
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} userModel
 * @returns
 */
export const authenticate = ({ userModel }) => {
  return async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, secret);
      const user = await userModel.findById({ id: decoded.id });
      if (!user) {
        return res.status(401).json({ message: 'The user does not exist' });
      }
      console.log('Executed');
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: JSON.parse(error.message) });
    }
  };
};

/**
 * Authorizes the user to access a specific route, depending on the role.
 * @param {*} role
 * @returns
 */
export const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
