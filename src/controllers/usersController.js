export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  signUp = async (req, res, next) => {
    try {
      const { username, password, nickname } = req.body;
      const user = await this.usersService.signUp(username, password, nickname);

      return res.status(user.status).json(user.message);
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await this.usersService.signIn(username, password);

      const token = user.message.token;

      // 쿠키에 토큰 전달
      res.cookie('token', token);

      // 사용자에게 반환되는 데이터
      return res.status(user.status).json(user.message);
    } catch (err) {
      next(err);
    }
  };

  auth = async (req, res, next) => {
    try {
      const { token } = req.cookies;

      if (!token) {
        return res.status(400).json({
          error: {
            code: 'TOKEN_NOT_FOUND',
            message: '토큰이 없습니다.',
          },
        });
      }

      const payload = await this.usersService.validateToken(token);

      if (!payload) {
        return res.status(401).json({
          error: {
            code: 'INVALID_TOKEN',
            message: '토큰이 유효하지 않습니다.',
          },
        });
      }

      // 사용자에게 반환되는 데이터
      return res.status(200).json({ message: '정상적으로 인증되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
