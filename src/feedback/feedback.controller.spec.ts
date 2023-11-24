import { Test, TestingModule } from "@nestjs/testing";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";
import { mockDeep } from "jest-mock-extended";
import { PrismaService } from "src/prisma.service";
import { TracksService } from "src/tracks/tracks.service";

describe("FeedbackController", () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [FeedbackService, PrismaService, TracksService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
