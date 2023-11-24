import { Test, TestingModule } from "@nestjs/testing";
import { TracksService } from "./tracks.service";
import { mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma.service";
import { TrackVersionsService } from "./trackversions.service";

describe("TracksService", () => {
  let service: TracksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksService, TrackVersionsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<TracksService>(TracksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
