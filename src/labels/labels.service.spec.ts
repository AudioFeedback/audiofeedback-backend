import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { PrismaService } from "../prisma.service";
import { LabelsService } from "./labels.service";

describe("LabelsService", () => {
  let service: LabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabelsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<LabelsService>(LabelsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
