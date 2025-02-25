import dotenv from 'dotenv';
import logger from "../config/logger/logger";
import HttpStatus from "../types/enums/HttpStatus";
import { RegisterUser } from "../types/interfaces/requestDTO/RegisterUser";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import db from '../config/db/db';
import ErrorResponse from '../utils/responses/ErrorResponse';
import SuccessResponse from '../utils/responses/SuccessResponse';
import { AuthRequest } from '../types/interfaces/requestDTO/AuthRequest';

dotenv.config();

const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: RegisterUser = req.body;
    try {

        if(!email || !password) {
            logger.error('User registration failed. Please provide related fields.');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'User registration query was failed',
                    'User registration failed'
                )
            );
        }

        const existingUser = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        ); 

        if (existingUser.rowCount) {
            logger.error("Already have an user for this email");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Register user query was falied",
                    "User already exists"
                )
            );
        }

        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, password]
        );
        logger.info("Register user query was successful");

        res.status(HttpStatus.CREATED).json(
            new SuccessResponse(
                HttpStatus.CREATED,
                'User registered query was successful',
                newUser.rows[0]
            )
        );
    } catch (error) {
        logger.error('User register query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'User register query internal server error',
                'User registration failed'
            )
        );
    }
};

const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: AuthRequest = req.body;
    try {
        if(!email) {
            logger.error('Email didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'User login query was failed',
                    'Please enter your email'
                )
            );
        }
        if(!password) {
            logger.error('Password didn\'t exist');
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'User login query was failed',
                    'Please enter your password'
                )
            );
        }

        const user = db.query('SELECT * from users WHERE email = $1', [email]);
        if ((await user).rows.length === 0) {
            logger.warn("User not found. Email is incorrect");
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    "User login query was failed",
                    "User not found. Email is incorrect."
                )
            );
        }

        if ((await user).rows[0].password != password) {
            logger.warn("Password is incorrect");
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "User login query was failed",
                    "Password is incorrect"
                )
            );
        }
  
        const accessToken = jwt.sign(
            { id: (await user).rows[0].id },
            process.env.JWT_SECRET, 
            { expiresIn: "1min" }
        );
        
        const refreshToken = jwt.sign(
            { id: (await user).rows[0].id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: "10min" }
        );

        const loggedUser = {
            id: (await user).rows[0].id,
            email: (await user).rows[0].email,
            created_at: (await user).rows[0].created_at
        }
  
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        return res.status(HttpStatus.ACCEPTED).json(
            new SuccessResponse(
                HttpStatus.ACCEPTED,
                'User login query was successfull',
                {
                    user: loggedUser,
                    accessToken: accessToken
                }
            )
        );
    } catch (error: any) {
        logger.error('User login query internal server error');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'User login query internal server error',
                'User login failed'
            )
        );
    }
};

const refreshToken = (req: Request, res: Response): Promise<any> => {
    return new Promise((resolve, reject) => {
        const { refreshToken } = req.cookies;
        console.log(refreshToken);
        if (!refreshToken) {
            logger.error('No refresh token. Please login again')
            return resolve(res.status(401).json({ message: 'No refresh token' }));
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err: any, decoded: any) => {
            if (err) {
                return resolve(res.status(403).json({ message: 'Invalid refresh token' }));
            }

            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET as string, 
                { expiresIn: '1min' }
            );

            return resolve(res.json({ accessToken: newAccessToken }));
        });
    });
};

const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(HttpStatus.REDIRECT).json(
        new SuccessResponse(
            HttpStatus.REDIRECT,
            'User token made expired',
            'Successfully logout'
        )
    );
};
  
export {
    register,
    login,
    refreshToken,
    logout
}