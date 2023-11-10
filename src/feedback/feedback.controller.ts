import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Req,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { GetFeedbackWithUserDto } from "./dto/get-feedback-with-user.dto";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { TracksService } from "src/tracks/tracks.service";

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
    console.log(" hoi");
    const track = await this.trackService.findOne(createFeedbackDto.trackId);
    const feedback = await this.feedbackService.create(
      createFeedbackDto,
      <User>req.user,
      track,
    );
    console.log(feedback);
    return new GetFeedbackWithUserDto(feedback);
  }

  @Get()
  async findAll() {
    return await this.feedbackService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.feedbackService.findOne(+id);
  }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateFeedbackDto: UpdateFeedbackDto,
  // ) {
  //   return this.feedbackService.update(+id, updateFeedbackDto);
  // }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.feedbackService.remove(+id);
  }
}
