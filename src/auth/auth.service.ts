import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<any> {
    const user = await this.usersService.findOne({ username: username });

    // const auth = await bcrypt.compare(pass, user.password);

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: string) {
    const claims = this.jwtService.decode(user);

    const signedUser = await this.usersService.findOne({ sub: claims.sub });

    const payload = { sub: signedUser.username, roles: signedUser.roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
