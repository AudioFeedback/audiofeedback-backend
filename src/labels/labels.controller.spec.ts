import { Test, TestingModule } from "@nestjs/testing";
import { mockDeep } from "jest-mock-extended";
import { PrismaService } from "../prisma.service";
import { UsersService } from "../users/users.service";
import { LabelsController } from "./labels.controller";
import { LabelsService } from "./labels.service";

describe("LabelsController", () => {
  let controller: LabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelsController],
      providers: [LabelsService, UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    controller = module.get<LabelsController>(LabelsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
