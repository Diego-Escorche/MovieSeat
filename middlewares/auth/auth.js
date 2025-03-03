import jwt from 'jsonwebtoken';
import JWT_SECRET from '../.env';

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
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
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
