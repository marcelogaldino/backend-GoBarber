import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err); // eslint-disable-line no-console

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

app.listen(3333, () => {
    console.log('🚀 server is running on port 3333'); // eslint-disable-line no-console
});
