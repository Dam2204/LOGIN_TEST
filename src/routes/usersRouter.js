// src/routes/usersRouter.js

import express from 'express';
import { UsersService } from '../services/usersService.js';

const router = express.Router();
const usersService = new UsersService();

/** 사용자 회원가입 API **/
router.post('/sign-up', usersService.signUp);

/** 사용자 로그인 API **/
router.post('/sign-in', usersService.signIn);

export default router;
