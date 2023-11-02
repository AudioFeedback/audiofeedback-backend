import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { TracksModule } from "./tracks/tracks.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ConfigModule.forRoot(), TracksModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
