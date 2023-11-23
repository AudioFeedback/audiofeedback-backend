import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { TracksService } from "src/tracks/tracks.service";
import { GetFeedbackDto } from "./dto/get-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@ApiTags("feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly trackService: TracksService,
  ) {}

  @Post()
  @Roles(Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Req() req: Request,
  ) {
    const trackVersion = await this.trackService.findOneTrackVersion(
      createFeedbackDto.trackVersionId,
    );
    const feedback = await this.feedbackService.create(
      createFeedbackDto,
      <User>req.user,
      trackVersion,
    );
    return new GetFeedbackDto(feedback);
  }

  // @Get()
  // @Roles(Role.FEEDBACKGEVER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // async findAll() {
  //   const feedback = await this.feedbackService.findAll();
  //   return feedback.map((x) => new GetFeedbackDto(x));
  // }

  // @Get(":id")
  // @Roles(Role.FEEDBACKGEVER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // findOne(@Param("id") id: number) {
  //   return this.feedbackService.findOne(+id);
  // }

  @Patch(":id")
  @Roles(Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async update(
    @Param("id") id: number,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return await this.feedbackService.update(+id, updateFeedbackDto);
  }

  @Patch("publish/:trackVersionId")
  @Roles(Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async publishFeedback(
    @Param("trackVersionId") trackVersionId: number,
    @Req() req: Request,
  ) {
    await this.feedbackService.publishFeedback(+trackVersionId, <User>req.user);
    const feedback = await this.feedbackService.findAll(
      +trackVersionId,
      <User>req.user,
    );
    return feedback.map((x) => new GetFeedbackDto(x));
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  remove(@Param("id") id: number) {
    return this.feedbackService.remove(+id);
  }
}
