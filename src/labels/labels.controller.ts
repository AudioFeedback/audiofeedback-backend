import { Controller, Get, HttpException, HttpStatus, Param, Req, UseGuards } from "@nestjs/common";
import { LabelsService } from "./labels.service";
import { Role, User } from "@prisma/client";
import { GetReviewTrackDto } from "src/tracks/dto/get-review-track.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@ApiTags("labels")
@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get("invites")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async getInvites(@Req() req: Request) {

  }
}
