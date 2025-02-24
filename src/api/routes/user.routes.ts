import { getUser } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/userAuthenticator';
import express from 'express';

const router = express.Router();

router.get('/:userId', authenticateToken, getUser);

export default router;