import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
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
      <User>req.user,
      createFeedbackDto.trackVersionId,
    );

    if (!trackVersion)
      throw new HttpException(
        "Track version niet gevonden.",
        HttpStatus.NOT_FOUND,
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
    @Req() req: Request,
  ) {
    return await this.feedbackService.update(
      +id,
      updateFeedbackDto,
      <User>req.user,
    );
  }

  @Patch("publish/:trackVersionId")
  @Roles(Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async publishFeedback(
    @Param("trackVersionId") trackVersionId: number,
    @Req() req: Request,
  ) {
    const res = await this.feedbackService.publishFeedback(
      +trackVersionId,
      <User>req.user,
    );

    if (res.count < 1)
      throw new HttpException("Feedback niet gevonden.", HttpStatus.NOT_FOUND);

    const feedback = await this.feedbackService.findAll(
      +trackVersionId,
      <User>req.user,
    );

    // determine is a label is connected to this track

    const track = await this.trackService.getTrackFromTrackVersion(
      +trackVersionId,
    );

    if (track.label === null) {
      this.trackService.publishReview(+trackVersionId);
    }

    return feedback.map((x) => new GetFeedbackDto(x));
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.FEEDBACKGEVER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async remove(@Param("id") id: number, @Req() req: Request) {
    const user = <User>req.user;

    if (user.roles.includes(Role.ADMIN)) {
      const existingFeedback = await this.feedbackService.isAllowedForDelete(
        +id,
      );

      if (!existingFeedback) {
        throw new NotFoundException(
          "Feedback with ID ${id} not found or already reviewed",
        );
      }
      return this.feedbackService.remove(+id);
    } else if (user.roles.includes(Role.FEEDBACKGEVER)) {
      const existingFeedback = await this.feedbackService.removeAsFeedbackgever(
        +id,
      );

      if (!existingFeedback) {
        throw new NotFoundException(
          "Feedback with ID ${id} not found or feedback is already published",
        );
      }
      return this.feedbackService.remove(+id);
    }
  }
}
