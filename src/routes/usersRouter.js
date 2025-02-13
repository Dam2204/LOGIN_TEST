// src/routes/usersRouter.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

/** 사용자 회원가입 API **/
router.post('/sign-up', async (req, res, next) => {
  const { username, password, nickname } = req.body;

  const isExistUser = await prisma.users.findFirst({
    where: {
      username,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 username 입니다.' });
  }

  // password hash 처리
  const hashedPassword = await bcrypt.hash(password, 10);

  // Users 테이블에 사용자를 추가합니다.
  const user = await prisma.users.create({
    data: {
      username,
      password: hashedPassword,
      nickname,
    },
  });

  return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
});

/** 사용자 로그인 API **/

router.post('/sign-in', async (req, res, next) => {
  const { username, password } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      username,
    },
  });

  // username, password 검증
  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ id: user.id }, 'custom-key');

  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인에 성공하였습니다.' });
});

export default router;
