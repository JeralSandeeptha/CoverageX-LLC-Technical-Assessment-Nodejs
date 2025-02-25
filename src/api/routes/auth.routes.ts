import { login, logout, refreshToken, register } from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);

export default router;