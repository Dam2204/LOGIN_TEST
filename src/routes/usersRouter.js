// src/routes/usersRouter.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { UsersService } from '../services/usersService.js';
import { UsersRepository } from '../repositories/usersRepository.js';
import { UsersController } from '../controllers/usersController.js';

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

/** 사용자 회원가입 API **/
router.post('/sign-up', usersController.signUp);

/** 사용자 로그인 API **/
router.post('/sign-in', usersController.signIn);

/** 사용자 인증 API **/
router.get('/auth', usersController.auth);

export default router;
