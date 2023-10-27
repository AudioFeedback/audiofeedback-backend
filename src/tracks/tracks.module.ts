import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, PrismaService],
})
export class TracksModule {}
