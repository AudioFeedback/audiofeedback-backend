import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { mockDeep } from "jest-mock-extended";
import { AuthService } from "./auth/auth.service";
import { UsersService } from "./users/users.service";
import { JwtService } from "@nestjs/jwt";

describe("AppController", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        PrismaService,
        AuthService,
        UsersService,
        JwtService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    appController = app.get<AppController>(AppController);
  });

  it("should be defined", () => {
    expect(appController).toBeDefined();
  });
});
