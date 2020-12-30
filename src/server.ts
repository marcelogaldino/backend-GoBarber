import 'reflect-metadata';

import express from 'express';
import cors from 'cors';

import routes from './routes';

import './database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

app.listen(3333, () => {
    console.log('🚀 server is running on port 3333');
});
