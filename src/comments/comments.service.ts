import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private userService: UsersService
  ) {}

  async create(
    text: string,
    user_Id: string,
    username: string,
    video_Id: string,
  ) {
    const comment = new this.commentModel({
      text,
      user_Id,
      username,
      video_Id,
    });
    const createdComment = await comment.save();
    console.log('comment in service', comment);
    console.log('createdComment in service', createdComment);
    return createdComment;
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findComments(video_Id: string): Promise<Comment[]> {
    return this.commentModel.find({ video_Id }).exec();
  }

  async remove(id: string): Promise<Comment> {
    try {
      const deletedComment = await this.commentModel.findByIdAndRemove(id);
      if (!deletedComment) {
        throw new NotFoundException(`Comment with ID ${id} not found.`);
      }
      return deletedComment;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting comment', error);
    }
  }

  async getUserProfilePicture(user_id: string): Promise<string | null> {
    return this.userService.getUserProfilePicture(user_id);
  }
}
