import logger from '../config/logger/logger';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction): Promise<any> => {
    
    return new Promise((resolve, reject) => {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            logger.error('Access denied. No token provided.');
            return resolve(res.status(401).json({ message: 'Access denied. No token provided.' }));
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    
            next();
        } catch (error) {
            logger.error('Invalid token');
            return resolve(res.status(403).json({ message: 'Invalid token.' }));
        }
    })
};

export {
    authenticateToken
}