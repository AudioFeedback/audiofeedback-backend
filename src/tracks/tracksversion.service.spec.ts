import { Test, TestingModule } from "@nestjs/testing";
import { TracksService } from "./tracks.service";
import { mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma.service";
import { TrackVersionsService } from "./trackversions.service";

describe("TracksversionService", () => {
  let service: TrackVersionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksService, TrackVersionsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<TrackVersionsService>(TrackVersionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
