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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { GetTrackWithAuthorDto } from "./dto/get-track-with-author.dto";
import { Role, User } from "@prisma/client";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import {
  TrackVersionData,
  TrackVersionsService,
} from "./trackversions.service";
import { GetTrackWithTrackVersionsDto } from "./dto/get-track-with-trackversions.dto";
import { GetTrackDeepDto } from "./dto/get-track-deep.dto";
import { GetTrackVersionDto } from "./dto/get-trackversion.dto";
import { CreateTrackVersionDto } from "./dto/create-trackversion.dto";
import { GetTrackWithAuthorAndReviewersDto } from "./dto/get-track-with-author-and-reviewers.dto";

@ApiTags("tracks")
@Controller("tracks")
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly trackVersionsService: TrackVersionsService,
  ) {}
  @Post()
  @Roles(Role.MUZIEKPRODUCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        genre: { type: "string" },
        reviewerIds: {
          type: "array",
          items: {
            type: "integer",
          },
        },
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
    const track = await this.tracksService.create(
      createTrackDto,
      <User>req.user,
    );

    const fileData = await this.tracksService.saveFile(file);

    if (!fileData) {
      // Todo: delete the created track
      throw new HttpException(
        "Error in het opslaan van het bestand.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const trackVersionData: TrackVersionData = {
      id: track.id,
      guid: fileData.guid,
      filetype: fileData.filetype,
      description: "Eerste versie van de track.",
      versionNumber: 1,
      duration: fileData.duration,
    };

    const trackVersion =
      await this.trackVersionsService.create(trackVersionData);

    return new GetTrackWithAuthorAndReviewersDto(track, trackVersion, req);
  }

  @Post("/:trackId")
  @Roles(Role.MUZIEKPRODUCER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async createNewVersion(
    @Body() createTrackDto: CreateTrackVersionDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param("trackId") trackId: number,
  ) {
    const track = await this.tracksService.findAllVersions(Number(trackId));
    if (!track) {
      throw new HttpException("Track niet gevonden.", HttpStatus.NOT_FOUND);
    }

    const fileData = await this.tracksService.saveFile(file);

    if (!fileData) {
      throw new HttpException(
        "Error in het opslaan van het bestand.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const trackVersionData: TrackVersionData = {
      id: trackId,
      guid: fileData.guid,
      filetype: fileData.filetype,
      description: createTrackDto.description,
      versionNumber:
        Math.max(...track.trackVersions.map((x) => x.versionNumber)) + 1,
      duration: fileData.duration,
    };

    const trackVersion =
      await this.trackVersionsService.create(trackVersionData);

    return new GetTrackVersionDto(trackVersion, req);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER, Role.ADMIN)
  async findAll(@Req() req: Request) {
    const tracks = await this.tracksService.findAll(<User>req.user);

    return tracks.map((x) => {
      return new GetTrackWithTrackVersionsDto(x, req);
    });
  }

  // @Post('reviewers')
  // async createTrack(
  // @Req() req: Request,
  // @Body()
  // createTrackDto: CreateTrackDto
  // ) {
  //   const trackWithReviewer = await this.tracksService.create(
  //     createTrackDto,
  //     <User>req.user,
  //   );
  //   return new GetTrackDto(trackWithReviewer);
  // }

  @Get("audio/:filename")
  @Header("Accept-Ranges", "bytes")
  async audio(@Param("filename") filename: string, @Res() res) {
    const file = await this.tracksService.getAudioFile(filename);
    res.setHeader("Content-Type", "audio/mpeg");
    await res.end(file);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER)
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const track = await this.tracksService.findOneDeep(+id);
    return new GetTrackDeepDto(track, req);
  }

  @Get("reviewer/reviewable")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async getReviewable(@Req() req: Request) {
    const tracks = await this.tracksService.getReviewable(<User>req.user);
    return tracks.map((x) => new GetTrackWithAuthorDto(x));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
  //   return this.tracksService.update(+id, updateTrackDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tracksService.remove(+id);
  // }
}
