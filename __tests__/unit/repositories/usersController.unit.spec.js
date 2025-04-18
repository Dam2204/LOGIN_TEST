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

  test('signUp Method by Failure (Validation Error)', async () => {
    const req = mockRequest({ password: 'testPassword', nickname: 'mentos' });
    const res = mockResponse();

    await usersController.signUp(req, res, mockNext);

    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('signUp Method by Failure (User Already Exists)', async () => {
    const req = mockRequest({
      username: 'existingUser',
      password: 'testPassword',
      nickname: 'mentos',
    });
    const res = mockResponse();
    mockUsersService.signUp.mockRejectedValue(new CustomError('User already exists', 409));

    await usersController.signUp(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(409);
  });

  test('signIn Method by Success', async () => {
    const req = mockRequest({ username: 'testUser', password: 'testPass' });
    const res = mockResponse();
    const mockUser = { id: 1, username: 'testUser', token: 'jwt-token' };
    mockUsersService.signIn.mockResolvedValue(mockUser);

    await usersController.signIn(req, res, mockNext);

    expect(mockUsersService.signIn).toHaveBeenCalledWith('testUser', 'testPass');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test('signIn Method by Failure (Validation Error)', async () => {
    const req = mockRequest({ username: '', password: 'testPass123' });
    const res = mockResponse();

    await usersController.signIn(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
  });

  test('signIn Method by Failure (User Not Found)', async () => {
    const req = mockRequest({ username: 'unknownUser', password: 'testPass' });
    const res = mockResponse();
    mockUsersService.signIn.mockRejectedValue(new CustomError('User not found', 404));

    await usersController.signIn(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
  });

  test('signIn Method by Failure (Incorrect Password)', async () => {
    const req = mockRequest({ username: 'testUser', password: 'wrongPass' });
    const res = mockResponse();
    mockUsersService.signIn.mockRejectedValue(new CustomError('Incorrect password', 401));

    await usersController.signIn(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect(mockNext.mock.calls[0][0].statusCode).toBe(401);
  });
});
