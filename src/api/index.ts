import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import logger from './config/logger/logger';
import './config/db/db';

dotenv.config();

const app = express();

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    logger.info(`Server is running at port ${port}`);
});