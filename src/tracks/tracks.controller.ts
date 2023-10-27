import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto, @UploadedFile() file: Express.Multer.File) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get('audio/:filename')
  async audio(@Param('filename') filename: string, @Res() res) {
    const fileStream = await this.tracksService.getAudioFile(filename);

    if (fileStream) {
      res.setHeader('Content-Type', 'audio/mpeg'); // Adjust content type as needed
      (await fileStream).pipe(res);
    } else {
      res.status(404).send('Audio not found');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.tracksService.uploadAudioFile(file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tracksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.tracksService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tracksService.remove(+id);
  }
}
