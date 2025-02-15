import { expect, jest } from '@jest/globals';
import { isValidPassword, isValidUsername } from '../../../src/utils/validation.js';

describe('signUp', () => {
  // 각 test가 실행되기 전에 모든 Mock을 초기화
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('아이디 유효성 검증 테스트', () => {
    expect(isValidUsername('kim')).toEqual(true);
    expect(isValidUsername('kim1004')).toEqual(false);
    expect(isValidUsername('1004')).toEqual(false);
    expect(isValidUsername('##')).toEqual(false);
    expect(isValidUsername(' ')).toEqual(false);
  });

  test('패스워드 유효성 검증 테스트', () => {
    expect(isValidPassword('1234Aaa!')).toEqual(true);
    expect(isValidPassword('123Aaaaaa')).toEqual(false);
    expect(isValidPassword('12341234')).toEqual(false);
    expect(isValidPassword('1234')).toEqual(false);
    expect(isValidPassword('asdasd')).toEqual(false);
    expect(isValidPassword(' ')).toEqual(false);
  });
});
