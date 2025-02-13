// src/server.js

import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/usersRouter.js';
import { PORT } from './constants/env.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', [UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
