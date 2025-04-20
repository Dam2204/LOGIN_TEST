// src/server.js

import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/usersRouter.js';
import { PORT } from './constants/env.js';
import LogMiddleware from './middlewares/logMiddleware.js';
import ErrorHandlingMiddleware from './middlewares/errorHandlingMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json' with { type: "json" };

const app = express();

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', [UsersRouter]);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
