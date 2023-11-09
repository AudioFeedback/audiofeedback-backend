import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // @Post()
  // create(@Body() createFeedbackDto: CreateFeedbackDto) {
  //   return this.feedbackService.create(createFeedbackDto);
  // }

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
