import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideoSchema } from './video.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Video', schema: VideoSchema}])],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
