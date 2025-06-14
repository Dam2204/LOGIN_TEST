import bcrypt from 'bcrypt';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findUserByUserName = async (username) => {
    const user = await this.prisma.users.findFirst({
      where: { username },
    });

    return user;
  };

  createUser = async (username, password, nickname) => {
    try {
      // password hash 처리
      const hashedPassword = await bcrypt.hash(password, 10);

      // 신규 사용자 등록
      const user = await this.prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          nickname,
        },
      });

      // username, nickname 값 추출
      const userData = await this.prisma.users.findFirst({
        where: {
          username: username,
        },
        select: {
          username: true,
          nickname: true,
        },
      });

      // 사용자에게 반환되는 데이터
      const confirmData = {
        username: userData.username,
        nickname: userData.nickname,
      };

      return confirmData;
    } catch (err) {
      console.error(err);
    }
  };
}
