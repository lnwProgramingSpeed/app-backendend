import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Object })
  url_path: object;
  
  @Prop()
  thumbnail: string;
  
  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  term: string;

  @Prop({ required: true })
  price: number;

  @Prop ({ required: true })
  date: Date;
  
  @Prop ({ required: true })
  buyTime: number;

  @Prop ({ required: true })
  owner_id: string;
}

export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);
