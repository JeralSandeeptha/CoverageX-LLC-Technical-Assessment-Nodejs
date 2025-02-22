import logger from 'api/config/logger/logger';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        logger.error('Access denied. No token provided.');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
        console.log(decoded);

        next();
    } catch (error) {
        logger.error('Invalid token');
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export {
    authenticateToken
}