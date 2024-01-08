import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InviteStatus, Role, User } from "@prisma/client";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { GetTrackWithReviewersDto } from "../tracks/dto/get-track-with-reviewers.dto";
import { GetLabelDto } from "./dto/get-label.dto";
import { GetLabelMemberWithLabelDto } from "./dto/get-labelmember-with-label.dto";
import { LabelsService } from "./labels.service";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { InviteUserDto } from "./dto/invite-user.dto";
import { UsersService } from "src/users/users.service";
import { UpdateLabelMemberStatusDto } from "./dto/update-labelmember-status.dto";
import { GetUserWithLabelMemberDto } from "src/users/dto/get-user-with-labelmember.dto";

@ApiTags("labels")
@Controller("labels")
export class LabelsController {
  constructor(
    private readonly labelsService: LabelsService,
    private readonly userService: UsersService,
  ) {}

  @Get("invites")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async getInvites(@Req() req: Request) {
    const labelMembers = await this.labelsService.getInvites(<User>req.user);

    return labelMembers.map((x) => new GetLabelMemberWithLabelDto(x));
  }

  @Post(":id/invite")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async inviteUser(
    @Param("id") labelId: number,
    @Body() inviteUser: InviteUserDto,
    @Req() req: Request,
  ) {
    const currentUser = <User>req.user;
    const admin = await this.userService.findOneDeep({ id: currentUser.id });

    if (
      !(
        admin.labelMember.find((x) => x.labelId == labelId)?.status ===
        InviteStatus.ACCEPTED
      )
    ) {
      throw new HttpException(
        `User does not have sufficient privileges.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.findOneDeep({
      id: +inviteUser.userId,
    });

    if (!user) {
      throw new HttpException(`User doesn't exists.`, HttpStatus.BAD_REQUEST);
    }

    if (!user.roles.includes(Role.FEEDBACKGEVER)) {
      throw new HttpException(
        `User is not a reviewer. `,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check of label bestaat
    const label = await this.labelsService.getLabelById(+labelId);
    if (!label) {
      throw new HttpException(
        `Label with ID: ${labelId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const labelMember = user.labelMember.find((x) => x.labelId === +labelId);

    if (!labelMember) {
      return await this.labelsService.invite(user, label);
    } else if (labelMember.status === InviteStatus.INVITED) {
      throw new HttpException(
        `User is already invited.`,
        HttpStatus.BAD_REQUEST,
      );
    } else if (labelMember.status === InviteStatus.ACCEPTED) {
      throw new HttpException(
        `User is already in label.`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return await this.labelsService.setInviteStatus(
        +labelMember.id,
        InviteStatus.INVITED,
      );
    }
  }

  @Patch(":id/accept")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async acceptInvite(
    @Param("id") labelId: number,
    @Body() inviteUser: UpdateLabelMemberStatusDto,
    @Req() req: Request,
  ) {
    const currentUser = <User>req.user;
    const user = await this.userService.findOneDeep({
      labelMember: {
        some: {
          id: +inviteUser.labelMemberId,
        },
      },
    });

    if (
      user.labelMember.find((x) => x.labelId == labelId).status !==
      InviteStatus.INVITED
    ) {
      throw new HttpException(`Invalid invite.`, HttpStatus.BAD_REQUEST);
    }

    if (user.id !== currentUser.id) {
      throw new HttpException(
        `User does not have sufficient privileges.`,
        HttpStatus.FORBIDDEN,
      );
    }

    // Check of label bestaat
    const label = await this.labelsService.getLabelById(+labelId);
    if (!label) {
      throw new HttpException(
        `Label with ID: ${labelId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.labelMember.map((x) => x.labelId).includes(labelId)) {
      throw new HttpException(`User already invited.`, HttpStatus.BAD_REQUEST);
    }

    return await this.labelsService.setInviteStatus(
      +inviteUser.labelMemberId,
      InviteStatus.ACCEPTED,
    );
  }

  @Patch(":id/decline")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async declineInvite(
    @Param("id") labelId: number,
    @Body() inviteUser: UpdateLabelMemberStatusDto,
    @Req() req: Request,
  ) {
    const currentUser = <User>req.user;
    const user = await this.userService.findOneDeep({
      labelMember: {
        some: {
          id: +inviteUser.labelMemberId,
        },
      },
    });

    if (
      user.labelMember.find((x) => x.labelId == labelId).status !==
      InviteStatus.INVITED
    ) {
      throw new HttpException(`Invalid invite.`, HttpStatus.FORBIDDEN);
    }

    if (user.id !== currentUser.id) {
      throw new HttpException(
        `User does not have sufficient privileges.`,
        HttpStatus.FORBIDDEN,
      );
    }

    // Check of label bestaat
    const label = await this.labelsService.getLabelById(+labelId);
    if (!label) {
      throw new HttpException(
        `Label with ID: ${labelId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.labelMember.map((x) => x.labelId).includes(labelId)) {
      throw new HttpException(`User already invited.`, HttpStatus.BAD_REQUEST);
    }

    return await this.labelsService.setInviteStatus(
      +inviteUser.labelMemberId,
      InviteStatus.DECLINED,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER, Role.ADMIN, Role.MUZIEKPRODUCER)
  async getLabels() {
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
  async getAllTracksForLabel(
    @Param("id") labelId: number,
    @Req() req: Request,
  ) {
    const labels = await this.labelsService.getAllTracksForLabel(+labelId);

    return labels.map(
      (x) => new GetTrackWithReviewersDto(x, <User>req.user, req),
    );
  }

  @Get(":id/reviewers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async getAvailableReviewers(@Param("id") labelId: number) {
    const reviewers = await this.labelsService.getAvailableReviewers(+labelId);
    return reviewers.map((x) => new GetUserDto(x));
  }

  @Get(":id/assigned-reviewers")
  async getAssignedReviewers(@Param("id") labelId: number) {
    const reviewers = await this.labelsService.getAssignedReviewers(+labelId);
    return reviewers.map((x) => new GetUserWithLabelMemberDto(x));
  }

  @Get("typeahead/:query")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER)
  async getLabelTypeahead(@Param("query") query: string) {
    const labels = await this.labelsService.getLabelTypeahead(query);

    return labels.map((x) => new GetLabelDto(x));
  }
}
