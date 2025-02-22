import { createTodo, getTodo, getTodosByUserId, updateTodo } from '../controllers/todo.controller';
import express from 'express';

const router = express.Router();

router.post('/', createTodo);
router.get('/:todoId', getTodo);
router.get('/getTodosByUserId/:userId', getTodosByUserId);
router.patch('/:todoId', updateTodo);

export default router;