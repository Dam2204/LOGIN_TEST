import { expect, jest } from '@jest/globals';
import { UsersController } from '../../../src/controllers/usersController.js';

const mockUsersService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  validateToken: jest.fn(),
};

const mockRequest = (body) => ({ body });

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let mockNext = jest.fn();

const usersController = new UsersController(mockUsersService);

describe('User Controller Unit Test', () => {
  // 각 test가 실행되기 전에 모든 Mock을 초기화
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signUp Method by Success', async () => {
    const req = mockRequest({
      username: 'jinho',
      password: 'testPassword',
      nickname: 'mentos',
    });
    const res = mockResponse();
    const mockUser = { id: 1, username: 'jinho', nickname: 'mentos' };
    mockUsersService.signUp.mockResolvedValue(mockUser);

    await usersController.signUp(req, res, mockNext);

    expect(mockUsersService.signUp).toHaveBeenCalledWith('jinho', 'testPassword', 'mentos');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('signUp Method by Failure (Validation error)', async () => {
    const req = mockRequest({ password: 'testPassword', nickname: 'mentos' });
    const res = mockResponse();

    await usersController.signUp(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('signUp Method by Failure (User already exists)', async () => {
    const req = mockRequest({
      username: 'existingUser',
      password: 'testPassword',
      nickname: 'mentos',
    });
    const res = mockResponse();
    mockUsersService.signUp.mockRejectedValue({
      status: 409,
      message: {
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: '이미 가입된 사용자입니다.',
        },
      },
    });

    await usersController.signUp(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(409);
  });

  test('signIn Method by Success', async () => {
    const req = mockRequest({ username: 'jinho', password: 'testPassword' });
    const res = mockResponse();
    const mockUser = { id: 1, username: 'jinho', token: 'jwt-token' };
    mockUsersService.signIn.mockResolvedValue(mockUser);

    await usersController.signIn(req, res, mockNext);

    expect(mockUsersService.signIn).toHaveBeenCalledWith('jinho', 'testPassword');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('signIn Method by Failure', async () => {
    const req = mockRequest({ username: 'jinho', password: 'wrongPassword' });
    const res = mockResponse();
    mockUsersService.signIn.mockRejectedValue({
      status: 400,
      message: {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      },
    });

    await usersController.signIn(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('auth Method by Success', async () => {
    const req = mockRequest({ token: 'jwt-token' });
    const res = mockResponse();

    const validation = {
      status: 200,
      message: { message: '정상적으로 인증되었습니다.' },
    };

    mockUsersService.validateToken.mockResolvedValue(validation);

    await usersController.auth(req, res, mockNext);

    expect(mockUsersService.validateToken).toHaveBeenCalledWith('jwt-token');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: '정상적으로 인증되었습니다.' });
  });

  test('auth Method by Failure (Invalid token)', async () => {
    const req = mockRequest({ token: 'wrong-token' });
    const res = mockResponse();
    mockUsersService.signIn.mockRejectedValue({
      status: 401,
      message: {
        error: {
          code: 'INVALID_TOKEN',
          message: '토큰이 유효하지 않습니다.',
        },
      },
    });

    await usersController.signIn(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
  });

  test('auth Method by Failure (Token not found)', async () => {
    const req = mockRequest();
    const res = mockResponse();
    mockUsersService.signIn.mockRejectedValue({
      status: 400,
      message: {
        error: {
          code: 'TOKEN_NOT_FOUND',
          message: '토큰이 없습니다.',
        },
      },
    });

    await usersController.signIn(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });
});
