import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { LabelsService } from "./labels.service";
import { Role, User } from "@prisma/client";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { Request } from "express";
import { GetLabelMemberWithLabelDto } from "./dto/get-labelmember-with-label.dto";

@ApiTags("labels")
@Controller("labels")
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get("invites")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async getInvites(@Req() req: Request) {
    const labelMembers = await this.labelsService.getInvites(<User>req.user);

    return labelMembers.map((x) => new GetLabelMemberWithLabelDto(x));
  }
}
