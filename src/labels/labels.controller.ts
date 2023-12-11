import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { GetTrackDto } from "../tracks/dto/get-track.dto";
import { GetLabelDto } from "./dto/get-label.dto";
import { GetLabelMemberWithLabelDto } from "./dto/get-labelmember-with-label.dto";
import { LabelsService } from "./labels.service";
import { GetUserDto } from "src/users/dto/get-user.dto";

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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER, Role.ADMIN, Role.MUZIEKPRODUCER)
  async getLabels(@Req() req: Request) {
    const labels = await this.labelsService.getLabels();

    return labels.map((x) => new GetLabelDto(x));
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER, Role.ADMIN, Role.MUZIEKPRODUCER)
  async getLabelById(@Param("id") labelId: number) {
    return new GetLabelDto(await this.labelsService.getLabelById(+labelId));
  }

  @Get(":id/tracks")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async getAllTracksForLabel(@Param("id") labelId: number) {
    const labels = await this.labelsService.getAllTracksForLabel(+labelId);

    return labels.map((x) => new GetTrackDto(x));
  }

  @Get("reviewers")
  async getAvailableReviewers() {
    const reviewers = await this.labelsService.getAvailableReviewers();
    return reviewers.map((x) => new GetUserDto(x));
  }
}
