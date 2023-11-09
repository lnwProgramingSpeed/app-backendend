import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  user_Id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  video_Id: string;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
