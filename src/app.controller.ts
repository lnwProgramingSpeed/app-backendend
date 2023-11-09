import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PusherService } from './pusher.service';

@Controller("api")
export class AppController {
  constructor(private appService: AppService, private pusherService: PusherService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("messages")
  async messages(
    @Body("username") username: string,
    @Body("message") message: string
  ) {
    await this.pusherService.trigger("chat", "message", {
      username,
      message
    });

    return [];
  }
}
