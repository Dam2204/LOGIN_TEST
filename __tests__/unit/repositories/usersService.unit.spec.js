import { expect, jest } from '@jest/globals';
import { UsersService } from '../../../src/services/usersService.js';
import bcrypt from 'bcrypt';

let mockUsersRepository = {
  findUserByUserName: jest.fn(),
  createUser: jest.fn(),
};

// usersService의 Repository를 Mock Repository로 의존성을 주입합니다.
let usersService = new UsersService(mockUsersRepository);

describe('Users Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('signUp Method', async () => {
    mockUsersRepository.findUserByUserName.mockResolvedValue(null);
    const userData = {
      username: 'jinho',
      password: 'Password123!',
      nickname: 'Mentos',
    };

    const sampleUser = {
      username: 'jinho',
      nickname: 'Mentos',
      authorities: [
        {
          authorityName: 'ROLE_USER',
        },
      ],
    };

    // usersService의 signUp Method를 실행합니다.
    const newUser = await usersService.signUp(
      userData.username,
      userData.password,
      userData.nickname,
    );

    // UsersRepository의 Method가 1번씩 호출되었는지 검증합니다.
    expect(mockUsersRepository.findUserByUserName).toHaveBeenCalledTimes(1);
  });

  test('signIn Method', async () => {
    const userData = {
      username: 'JINHO',
      password: 'Password123!',
    };

    const userToken = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    mockUsersRepository.findUserByUserName.mockResolvedValue(userData);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // usersService의 signUp Method를 실행합니다.
    const user = await usersService.signIn(userData.username, userData.password);

    // UsersRepository의 Method가 1번씩 호출되었는지 검증합니다.
    expect(mockUsersRepository.findUserByUserName).toHaveBeenCalledTimes(1);
  });
});
