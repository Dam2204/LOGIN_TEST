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

      const payload = await this.usersService.validateToken(token);

      // 사용자에게 반환되는 데이터
      return res.status(payload.status).json(payload.message);
    } catch (err) {
      next(err);
    }
  };
}
