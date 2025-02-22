import ErrorResponse from "../utils/responses/ErrorResponse";
import SuccessResponse from "../utils/responses/SuccessResponse";
import logger from "../config/logger/logger";
import { Request, Response } from "express";
import HttpStatus from "../types/enums/HttpStatus";
import { TodoRequest } from "../types/interfaces/requestDTO/TodoRequest";
import db from '../config/db/db';

const createTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, description, userId }: TodoRequest = req.body;

        if(!title || !description || !userId) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Create todo query was failed',
                    'Required fields are missing (title, description)'
                )
            )
        }

        const todoResponse = await db.query(
            "INSERT INTO task (title, description, userId, isCompleted) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, description, userId, false]
        )

        if(todoResponse.rows.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Create todo query was failed',
                    'Failed to create a new todo record'
                )
            )
        }

        logger.info('Create todo query was successful');
        return res.status(HttpStatus.CREATED).json(
            new SuccessResponse(
                HttpStatus.CREATED,
                'Create todo query was successful',
                await todoResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error('Create todo Internal Server Error');
        logger.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Create todo Internal Server Error',
                error. message 
            )
        );   
    }
}

const getTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { todoId } = req.params;

        if(!todoId) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Get todo query was failed',
                    'Required fields are missing (todoId)'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM task WHERE id = $1', [todoId]);

        if(dbResponse.rows.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json(
                new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Get todo query was failed',
                    'Todo not found'
                )
            )
        }

        logger.info('Get todo query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get todo query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error('Get todo Internal Server Error');
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get todo Internal Server Error',
                error. message 
            )
        );   
    }
}

const updateTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        const { todoId } = req.params;

        console.log(todoId);

        if(!todoId) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Update todo query was failed',
                    'Required fields are missing (todoId)'
                )
            )
        }

        const dbResponse = await db.query('UPDATE task SET isCompleted = $1 WHERE id = $2', [true, todoId]);

        logger.info('Update todo query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Update todo query was successful',
                dbResponse.rows[0]
            )
        )
    } catch (error) {
        logger.error('Update todo Internal Server Error');
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Update todo Internal Server Error',
                error. message 
            )
        );   
    }
}

const getTodosByUserId = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if(!userId) {
            return res.status(HttpStatus.BAD_REQUEST).json(
                new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    'Get todos by userId query was failed',
                    'Required fields are missing (userId)'
                )
            )
        }

        const dbResponse = await db.query('SELECT * FROM task WHERE userId = $1', [userId]);

        logger.info('Get todos by userId query was successful');
        return res.status(HttpStatus.OK).json(
            new SuccessResponse(
                HttpStatus.OK,
                'Get todos by userId query was successful',
                dbResponse.rows
            )
        )
    } catch (error) {
        logger.error('Get todos by userId Internal Server Error');
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Get todos by userId Internal Server Error',
                error. message
            )
        );   
    }
}

export {
    createTodo,
    getTodo,
    updateTodo,
    getTodosByUserId
}