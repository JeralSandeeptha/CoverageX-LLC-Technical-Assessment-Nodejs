import { authenticateToken } from '../middlewares/userAuthenticator';
import { createTodo, getTodo, getTodosByUserId, updateTodo } from '../controllers/todo.controller';
import express from 'express';

const router = express.Router();

router.post('/', authenticateToken, createTodo);
router.get('/:todoId', authenticateToken, getTodo);
router.get('/getTodosByUserId/:userId', authenticateToken, getTodosByUserId);
router.patch('/:todoId', authenticateToken, updateTodo);

export default router;