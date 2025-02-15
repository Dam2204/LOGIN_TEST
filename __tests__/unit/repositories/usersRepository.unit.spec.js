// __tests__/unit/usersRepository.unit.spec.js

import { expect, jest } from '@jest/globals';
import { UsersRepository } from '../../../src/repositories/usersRepository';

let mockPrisma = {
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  authority: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

let usersRepository = new UsersRepository(mockPrisma);

describe('Users Repository Unit Test', () => {
  // 각 test가 실행되기 전에 모든 Mock을 초기화
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('createUser Method', async () => {
    const mockCreateReturn = 'create User Return String';
    mockPrisma.users.create.mockReturnValue(mockCreateReturn);
    mockPrisma.authority.create.mockReturnValue(mockCreateReturn);

    const mockFindFirstReturn = 'findFirst User Return String';
    mockPrisma.users.findFirst.mockReturnValue(mockFindFirstReturn);
    mockPrisma.authority.findFirst.mockReturnValue(mockFindFirstReturn);

    const createUserParams = {
      username: 'createUserName',
      password: 'createPassword123!',
      nickname: 'createNickName',
    };

    const createUser = await usersRepository.createUser(
      createUserParams.username,
      createUserParams.password,
      createUserParams.nickname,
    );

    // create 메서드가 1번씩 실행된다.
    expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.authority.create).toHaveBeenCalledTimes(1);

    // create 메서드에 전달한 데이터 검증
    // hash된 password 대조 이슈로 mockPrisma.users.create 데이터 검증 보류. 추가 검토 필요.
    expect(mockPrisma.authority.create).toHaveBeenCalledWith({
      data: {
        userId: createUser.id,
      },
    });

    // findFirst 메서드가 1번씩 실행된다.
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.authority.findFirst).toHaveBeenCalledTimes(1);
  });
});
