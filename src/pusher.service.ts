import { Injectable } from "@nestjs/common";
import * as Pusher from "pusher";

@Injectable()
export class PusherService {
  pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: "1700286",
      key: "d3a49da1536a6af334ff",
      secret: "7c82cb24651033331dcb",
      cluster: "ap1",
      useTLS: true
    });
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
