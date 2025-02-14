// username이 유효한지 확인하는 함수
export const isValidUsername = (value) => {
  const username = value || '';

  // 영어 소문자만 허용, 1~30 글자 제한
  if (!/^[a-z]{1,30}$/.test(username)) {
    return false;
  }

  return true;
};

// password가 유효한지 확인하는 함수
export const isValidPassword = (value) => {
  const password = value || '';

  // 최소 8자리 이상 영문 대소문자, 숫자, 특수문자가 각각 1개 이상
  if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(password)) {
    return false;
  }

  return true;
};
