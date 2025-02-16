export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  signUp = async (req, res, next) => {
    try {
      const { username, password, nickname } = req.body;
      const user = await this.usersService.signUp(username, password, nickname);

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await this.usersService.signIn(username, password);

      // 쿠키에 토큰 전달
      res.cookie('accessToken', `Bearer ${user.accessToken}`);
      res.cookie('refreshToken', `Bearer ${user.refreshToken}`);

      // 사용자에게 반환되는 데이터
      return res.status(200).json({ token: user.accessToken });
    } catch (err) {
      next(err);
    }
  };
}
