// import { isValidPassword, isValidUsername } from '../utils/validation.js';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.js';
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

      // // username 조건에 벗어나는 경우
      // if (!isValidUsername(username)) {
      //   const errorMessage = {
      //     status: 400,
      //     message: {
      //       error: {
      //         code: 'USER_NAME_RULE',
      //         message: 'username은 영어 소문자 1~30 글자만 입력 가능합니다.',
      //       },
      //     },
      //   };
      //   return errorMessage;
      // }

      // // password 조건에 벗어나는 경우
      // if (!isValidPassword(password)) {
      //   const errorMessage = {
      //     status: 400,
      //     message:
      //       'password는 최소 8자리 이상 영문 대소문자, 숫자, 특수문자가 각각 1개 이상 입력해주세요.',
      //   };
      //   return errorMessage;
      // }

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
      const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });

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
}
