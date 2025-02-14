// src/routes/usersRouter.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.js';
import { isValidPassword, isValidUsername } from '../utils/validation.js';

const router = express.Router();

/** 사용자 회원가입 API **/
router.post('/sign-up', async (req, res, next) => {
  try {
    const { username, password, nickname } = req.body;

    // username 조건에 벗어나는 경우
    if (!isValidUsername(username)) {
      return res.status(400).json({ message: '영어 소문자 1~30 글자만 입력 가능합니다.' });
    }

    // 존재하는 사용자인지 조회회
    const isExistUser = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    // 이미 존재하는 사용자일 경우
    if (isExistUser) {
      return res.status(400).json({ message: '이미 존재하는 username 입니다.' });
    }

    // password 조건에 벗어나는 경우
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: '최소 8자리 이상 영문 대소문자, 숫자, 특수문자가 각각 1개 이상 입력해주세요.',
      });
    }

    // password hash 처리
    const hashedPassword = await bcrypt.hash(password, 10);

    // 신규 사용자 등록
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        nickname,
      },
    });

    // 사용자 권한 등록
    const authority = await prisma.authority.create({
      data: {
        userId: user.id,
      },
    });

    // username, nickname 값 추출
    const userData = await prisma.users.findFirst({
      where: {
        username: username,
      },
      select: {
        username: true,
        nickname: true,
      },
    });

    // authorities 추출
    const authorities = await prisma.authority.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        authorityName: true,
      },
    });

    // 사용자에게 반환되는 데이터
    const confirmData = {
      username: userData.username,
      nickname: userData.nickname,
      authorities: authorities,
    };

    return res.status(201).json(confirmData);
  } catch (err) {
    next(err);
  }
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

  // jwt 토큰 발급
  const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });

  // 쿠키에 토큰 전달
  res.cookie('accessToken', `Bearer ${accessToken}`);
  res.cookie('refreshToken', `Bearer ${refreshToken}`);

  // 사용자에게 반환되는 데이터
  return res.status(200).json({ token: accessToken });
});

export default router;
