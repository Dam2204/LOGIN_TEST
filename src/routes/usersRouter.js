// src/routes/usersRouter.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { UsersService } from '../services/usersService.js';
import { UsersRepository } from '../repositories/usersRepository.js';

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(prisma, usersRepository);

/** 사용자 회원가입 API **/
router.post('/sign-up', usersService.signUp);

/** 사용자 로그인 API **/
router.post('/sign-in', usersService.signIn);

export default router;
