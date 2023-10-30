import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("tracks")
@Controller("tracks")
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        genre: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tracksService.create(createTrackDto, file);
  }

  @Get()
  async findAll() {
    return this.tracksService.findAll();
  }

  @Get("audio/:filename")
  async audio(@Param("filename") filename: string, @Res() res) {
    const fileStream = await this.tracksService.getAudioFile(filename);

    if (fileStream) {
      res.setHeader("Content-Type", "audio/mpeg"); // Adjust content type as needed
      (await fileStream).pipe(res);
    } else {
      res.status(404).send("Audio not found");
    }
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
