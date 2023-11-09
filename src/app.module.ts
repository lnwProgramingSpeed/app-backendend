import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideosModule } from './videos/videos.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { PusherService } from './pusher.service';

@Module({
  imports: [
    VideosModule,
    UsersModule,
    CommentsModule,
    MongooseModule.forRoot(
      'mongodb+srv://hacker-man:HtE4dm9mX5bSUU6G@cluster0.3p7cyma.mongodb.net/Hackathon?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService, PusherService],
})
export class AppModule {}
