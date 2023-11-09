import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Header,
  Req,
  UseGuards,
} from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { GetTrackWithAuthorDto } from "./dto/get-track-with-author.dto";
import { Role } from "@prisma/client";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { GetTrackWithAuthorAndFeedbackDto } from "./dto/get-track-with-autor-and-feedback";

@ApiTags("tracks")
@Controller("tracks")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @Roles(Role.MUZIEKPRODUCER)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        genre: { type: "string" },
        authorId: { type: "number" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const track = await this.tracksService.create(createTrackDto, file);

    return new GetTrackWithAuthorDto(track, req);
  }

  @Get()
  @Roles(Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN)
  async findAll(@Req() req: Request) {
    const tracks = await this.tracksService.findAll(req);

    return tracks.map((x) => {
      return new GetTrackWithAuthorAndFeedbackDto(x, req);
    });
  }

  @Get("audio/:filename")
  @Roles(Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN)
  @Header("Accept-Ranges", "bytes")
  async audio(@Param("filename") filename: string, @Res() res) {
    const file = await this.tracksService.getAudioFile(filename);
    res.setHeader("Content-Type", "audio/mpeg");
    await res.end(file);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tracksService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
  //   return this.tracksService.update(+id, updateTrackDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tracksService.remove(+id);
  // }
}
