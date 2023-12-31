import { Test, TestingModule } from "@nestjs/testing";
import { FeedbackService } from "./feedback.service";
import { PrismaService } from "src/prisma.service";
import { TracksService } from "src/tracks/tracks.service";
import { mockDeep } from "jest-mock-extended";

describe("FeedbackService", () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService, PrismaService, TracksService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
