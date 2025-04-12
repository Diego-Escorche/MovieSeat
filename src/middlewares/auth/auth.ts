import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/user.js';
import { IUser } from '../../interfaces/user.js';
import { asyncHandler } from '../../utils.js';

dotenv.config();

const secret = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface AuthenticateParams {
  userService: UserService;
}
/**
 * Authenticates user via JWT token in cookies.
 */
export const authenticate = ({ userService }: AuthenticateParams) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies?.access_token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const decoded = jwt.verify(token, secret) as { id: string };
        const user = await userService.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ message: 'The user does not exist' });
        }

        req.user = user;
        next();
      } catch (error: any) {
        res.status(401).json({ message: error.message });
      }
    },
  );
};

/**
 * Authorizes user access based on role.
 */
export const authorize = (role: string) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.user?.role.includes(role)) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    },
  );
};
