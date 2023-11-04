import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { TracksModule } from "./tracks/tracks.module";
import { UsersModule } from "./users/users.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), TracksModule, UsersModule, FeedbackModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
