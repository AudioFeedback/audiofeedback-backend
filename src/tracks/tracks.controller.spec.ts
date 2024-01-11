import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { TracksController } from "./tracks.controller";
import { TracksService } from "./tracks.service";
import { TrackVersionsService } from "./trackversions.service";
import { PrismaService } from "src/prisma.service";
import { mockDeep } from "jest-mock-extended";

describe("TracksController", () => {
  let controller: TracksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [TracksService, TrackVersionsService, UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    controller = module.get<TracksController>(TracksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
