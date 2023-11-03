import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { TracksModule } from "./tracks/tracks.module";
import { UsersModule } from "./users/users.module";
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [ConfigModule.forRoot(), TracksModule, UsersModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
