// __tests__/unit/usersRepository.unit.spec.js

import { expect, jest } from '@jest/globals';
import { UsersRepository } from '../../../src/repositories/usersRepository';

const mockPrisma = {
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

const usersRepository = new UsersRepository(mockPrisma);

describe('Users Repository Unit Test', () => {
  // 각 test가 실행되기 전에 모든 Mock을 초기화
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findUserByUserName Method', async () => {
    const mockUser = {
      id: 1,
      username: 'jinho',
      password: '$2b$10$HObruUV3lDJ1zyNB6QpDvuN4v//DGOVJsJ3C4ft.3RrlSz6An1to.',
      nickname: 'mentos',
    };

    mockPrisma.users.findFirst.mockResolvedValue(mockUser);

    const user = await usersRepository.findUserByUserName('jinho');

    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);

    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
      where: { username: 'jinho' },
    });
  });

  test('createUser Method', async () => {
    const mockCreateReturn = 'create User Return String';
    mockPrisma.users.create.mockReturnValue(mockCreateReturn);

    const mockFindFirstReturn = 'findFirst User Return String';
    mockPrisma.users.findFirst.mockReturnValue(mockFindFirstReturn);

    const newUser = {
      username: 'jinho',
      password: 'testPassword',
      nickname: 'mentos',
    };

    const createdUser = {
      id: 123,
      ...newUser,
    };

    mockPrisma.users.create.mockResolvedValue(createdUser);

    const result = await usersRepository.createUser(
      newUser.username,
      newUser.password,
      newUser.nickname,
    );

    // create 메서드가 1번씩 실행된다.
    expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);

    // findFirst 메서드가 1번씩 실행된다.
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);

    // findFirst 메서드가 특정 인자들과 함께 호출되었는지 검증
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
      where: {
        username: 'jinho',
      },
      select: {
        username: true,
        nickname: true,
      },
    });
  });
});
