import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { GetUserWithNotificationsDto } from "./users/dto/get-user-with-notifications.dto";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  hello() {
    return "🐳  🎀  𝒱𝑒𝓇𝓈𝒾𝑒 𝟤.0  🎀  🐳";
  }

  @ApiConsumes("application/json")
  @Post("auth/login")
  async login(@Body() login: LoginDto): Promise<LoginDto> {
    return this.authService.login(login.access_token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get("profile")
  async getProfile(@Request() req) {
    const user = await this.userService.findOne({
      username: req.user.username,
    });

    const notifications = await this.userService.getNotifications(user);

    return new GetUserWithNotificationsDto(user, notifications);
  }
}
