import { isValidPassword, isValidUsername } from '../utils/validation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.js';

export class UsersService {
  constructor(prisma, usersRepository) {
    this.prisma = prisma;
    this.usersRepository = this.usersRepository;
  }

  signUp = async (req, res, next) => {
    try {
      const { username, password, nickname } = req.body;
      // username 조건에 벗어나는 경우
      if (!isValidUsername(username)) {
        return res
          .status(400)
          .json({ message: 'username은 영어 소문자 1~30 글자만 입력 가능합니다.' });
      }

      // password 조건에 벗어나는 경우
      if (!isValidPassword(password)) {
        return res.status(400).json({
          message:
            'password는 최소 8자리 이상 영문 대소문자, 숫자, 특수문자가 각각 1개 이상 입력해주세요.',
        });
      }

      // 존재하는 사용자인지 조회
      const isExistUser = await this.prisma.users.findFirst({
        where: {
          username,
        },
      });

      // 이미 존재하는 사용자일 경우
      if (isExistUser) {
        return res.status(400).json({ message: '이미 존재하는 username 입니다.' });
      }

      // 신규 사용자 등록
      const createUser = await this.usersRepository.createUser(username, password, nickname);

      return res.status(200).json(createUser);
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // 사용자 조회
      const user = await this.prisma.users.findFirst({
        where: {
          username,
        },
      });

      // username 검증
      if (!user) {
        return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
      }

      // password 검증
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
    } catch (err) {
      next(err);
    }
  };
}
