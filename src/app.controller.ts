import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { AppService } from "./app.service";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { UsersService } from "./users/users.service";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { GetUserWithNotifications } from "./users/dto/get-user-with-notifications";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Get()
  hello() {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @ApiConsumes("application/json")
  @Post("auth/login")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        username: { type: "string" },
        password: { type: "string" },
      },
    },
  })
  async login(@Request() req): Promise<LoginDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("profile")
  async getProfile(@Request() req) {
    const user = await this.userService.findOne({
      username: req.user.username,
    });

    const notifications = await this.userService.getNotifications(user);

    return new GetUserWithNotifications(user, notifications);
  }
}
