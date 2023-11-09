import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  purchaseVideos: string[];

  @Prop({ required: true })
  profilePicture: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
