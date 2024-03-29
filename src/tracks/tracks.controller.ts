import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { GetUserDto } from "src/users/dto/get-user.dto";
import { UsersService } from "src/users/users.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import { CreateTrackVersionDto } from "./dto/create-trackversion.dto";
import { GetReviewTrackDto } from "./dto/get-review-track.dto";
import { GetTrackDeepDto } from "./dto/get-track-deep.dto";
import { GetTrackWithAuthorDto } from "./dto/get-track-with-author.dto";
import { GetTrackWithLabelOrReviewersAndAuthor } from "./dto/get-track-with-label-or-reviewers-and.author.dto";
import { GetTrackDto } from "./dto/get-track.dto";
import { GetTrackVersionDto } from "./dto/get-trackversion.dto";
import { UpdateTrackReviewersDto } from "./dto/update-track-reviewers.dto";
import { UpdateTrackDto } from "./dto/update-track.dto";
import { TracksService } from "./tracks.service";
import {
  TrackVersionData,
  TrackVersionsService,
} from "./trackversions.service";

@ApiTags("tracks")
@Controller("tracks")
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly trackVersionsService: TrackVersionsService,
    private readonly usersService: UsersService,
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
        labelId: { type: "number" },
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
    if (createTrackDto.labelId && createTrackDto.reviewerIds) {
      throw new HttpException(
        "Both label & reviewers provided",
        HttpStatus.BAD_REQUEST,
      );
    }

    const fileData = await this.tracksService.saveFile(file);

    if (!fileData) {
      throw new HttpException(
        "Error in het opslaan van het bestand.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const track = await this.tracksService.create(
      createTrackDto,
      <User>req.user,
    );

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

    return new GetTrackWithLabelOrReviewersAndAuthor(track, trackVersion, req);
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
  @Roles(Role.MUZIEKPRODUCER, Role.FEEDBACKGEVER)
  async findAll(@Req() req: Request) {
    const tracks = await this.tracksService.findAll(<User>req.user);

    return tracks.map((x) => {
      return new GetTrackWithAuthorDto(x, <User>req.user);
    });
  }

  @Get("/producer")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER)
  async findAllForProducer(@Req() req: Request) {
    const tracks = await this.tracksService.findAllProducer(<User>req.user);

    return tracks.map((x) => {
      return new GetTrackWithAuthorDto(x, <User>req.user, Role.MUZIEKPRODUCER);
    });
  }

  @Get("/reviewer")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async findAllForReviewer(@Req() req: Request) {
    const tracks = await this.tracksService.findAllReviewer(<User>req.user);

    return tracks.map((x) => {
      return new GetTrackWithAuthorDto(x, <User>req.user, Role.FEEDBACKGEVER);
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
  @Roles(Role.MUZIEKPRODUCER, Role.ADMIN)
  async findOne(@Param("id") id: number, @Req() req: Request) {
    const track = await this.tracksService.findOneDeep(+id, <User>req.user);

    if (!track) {
      throw new HttpException(
        `Track with ID:${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return new GetTrackDeepDto(track, req);
  }

  @Get("review/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.FEEDBACKGEVER)
  async getReviewTrack(@Param("id") id: number, @Req() req: Request) {
    const tracks = await this.tracksService.findAllReviewer(<User>req.user);
    if (!tracks.map((x) => x.id).includes(+id)) {
      throw new HttpException("Unauthorized track", HttpStatus.UNAUTHORIZED);
    }

    const track = await this.tracksService.findOneDeepReviewer(
      +id,
      <User>req.user,
    );
    return new GetReviewTrackDto(track, req);
  }

  @Get(":id/assigned-reviewers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER)
  async getAssignedReviewers(@Param("id") id: number) {
    const reviewers = await this.usersService.getAssignedReviewers(+id);
    return reviewers.map((x) => new GetUserDto(x));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER, Role.ADMIN)
  @Patch(":id/reviewers")
  async updateReviewers(
    @Param("id") id: string,
    @Body() updateTrackReviewersDto: UpdateTrackReviewersDto,
  ) {
    await this.tracksService.updateReviewers(+id, updateTrackReviewersDto);
    return true;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Patch(":trackversionId/publish")
  async publishFeedback(@Param("trackversionId") id: number) {
    return await this.tracksService.publishReview(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER)
  @Delete("trackversion/:trackversionId")
  async deleteTrackVersion(@Param("trackversionId") id: number) {
    const trackVersion = await this.tracksService.findTrackVersion(+id);

    if (!trackVersion) {
      throw new HttpException(
        `Track version with ID:${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const res = this.tracksService.deleteTrackVersion(+id);
    await this.tracksService.deleteFile(
      `${trackVersion.guid}.${trackVersion.filetype}`,
    );

    return res;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER, Role.ADMIN)
  @Patch(":id/update")
  async update(
    @Param("id") id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.tracksService.updateTrack(+id, updateTrackDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Delete(":id/reviewers/:reviewerId")
  async removeReviewers(
    @Param("id") id: number,
    @Param("reviewerId") reviewerId: number,
  ) {
    return await this.tracksService.removeReviewers(+id, +reviewerId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.MUZIEKPRODUCER)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    const res = await this.tracksService.deleteTrack(+id);

    return new GetTrackDto(res);
  }
}
