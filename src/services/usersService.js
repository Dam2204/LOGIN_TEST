import { isValidPassword, isValidUsername } from '../utils/validation.js';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CustomError from '../utils/customError.js';

export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signUp = async (username, password, nickname) => {
    try {
      // 존재하는 사용자인지 조회
      const isExistUser = await this.usersRepository.findUserByUserName(username);

      // 이미 존재하는 사용자일 경우
      if (isExistUser) {
        throw new CustomError('이미 존재하는 username 입니다.', 400);
      }

      // username 조건에 벗어나는 경우
      if (!isValidUsername(username)) {
        throw new CustomError('username은 영어 소문자 1~30 글자만 입력 가능합니다.', 400);
      }

      // password 조건에 벗어나는 경우
      if (!isValidPassword(password)) {
        throw new CustomError(
          'password는 최소 8자리 이상 영문 대소문자, 숫자, 특수문자가 각각 1개 이상 입력해주세요.',
          400,
        );
      }

      // 신규 사용자 등록
      const createUser = await this.usersRepository.createUser(username, password, nickname);

      return createUser;
    } catch (err) {
      console.error(err);
    }
  };

  signIn = async (username, password) => {
    try {
      // 사용자 조회
      const user = await this.usersRepository.findUserByUserName(username);

      // username 검증
      if (!user) {
        throw new CustomError('존재하지 않는 사용자입니다.', 401);
      }

      // password 검증
      if (!(await bcrypt.compare(password, user.password))) {
        throw new CustomError('비밀번호가 일치하지 않습니다.', 401);
      }

      // jwt 토큰 발급
      const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });
      const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' });

      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      // 사용자에게 반환되는 데이터
      return token;
    } catch (err) {
      console.error(err);
    }
  };
}
