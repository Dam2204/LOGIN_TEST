// import { isValidPassword, isValidUsername } from '../utils/validation.js';
import { ACCESS_TOKEN_SECRET_KEY } from '../constants/env.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'USER_ALREADY_EXISTS',
              message: '이미 가입된 사용자입니다.',
            },
          },
        };
        return errorMessage;
      }

      // username이 누락된 경우
      if (!username) {
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'USER_NAME_NULL',
              message: 'username을 입력해주세요.',
            },
          },
        };
        return errorMessage;
      }

      // password가 누락된 경우
      if (!password) {
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'USER_PASSWORD_NULL',
              message: 'password를 입력해주세요.',
            },
          },
        };
        return errorMessage;
      }

      // nickname이 누락된 경우
      if (!nickname) {
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'USER_NICKNAME_NULL',
              message: 'nickname을 입력해주세요.',
            },
          },
        };
        return errorMessage;
      }

      // 신규 사용자 등록
      const createUser = await this.usersRepository.createUser(username, password, nickname);

      const successMessage = {
        status: 200,
        message: createUser,
      };

      return successMessage;
    } catch (err) {
      console.error(err);
    }
  };

  signIn = async (username, password) => {
    try {
      // 사용자 조회
      const user = await this.usersRepository.findUserByUserName(username);

      // username, password 검증
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'INVALID_CREDENTIALS',
              message: '아이디 또는 비밀번호가 올바르지 않습니다.',
            },
          },
        };
        return errorMessage;
      }

      // jwt 토큰 발급
      const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1m' });

      const successMessage = {
        status: 200,
        message: {
          token: accessToken,
        },
      };

      return successMessage;
    } catch (err) {
      console.error(err);
    }
  };

  validateToken = async (token) => {
    try {
      if (!token) {
        const errorMessage = {
          status: 400,
          message: {
            error: {
              code: 'TOKEN_NOT_FOUND',
              message: '토큰이 없습니다.',
            },
          },
        };
        return errorMessage;
      }

      const validation = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

      const successMessage = {
        status: 200,
        message: { message: '정상적으로 인증되었습니다.' },
      };

      return successMessage;
    } catch (err) {
      const errorMessage = {
        status: 400,
        message: {
          error: {
            code: 'INVALID_TOKEN',
            message: '토큰이 유효하지 않습니다.',
          },
        },
      };
      return errorMessage;
    }
  };
}
