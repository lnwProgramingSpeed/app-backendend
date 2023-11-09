import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body('text') text: string,
    @Body('user_Id') user_Id: string,
    @Body('username') username: string,
    @Body('video_Id') video_Id: string,
  ) {
    console.log('obj in controller', { text, user_Id, username, video_Id });
    return this.commentsService.create(text, user_Id, username, video_Id);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':video_id')
  findOne(@Param('video_id') video_id: string) {
    return this.commentsService.findComments(video_id);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    try {
      const deletedComment = await this.commentsService.remove(id);
      if (!deletedComment) {
        throw new NotFoundException(`Comment with ID ${id} not found.`);
      }
      return deletedComment;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting comment', error);
    }
  }
}
