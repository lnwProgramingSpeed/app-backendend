import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  async addVideo(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('url_path') url_path: Object,
    @Body('thumbnail') thumbnail: string,
    @Body('university') university: string,
    @Body('year') year: string,
    @Body('term') term: string,
    @Body('price') price: number,
    @Body('owner_id') owner_id: string,
  ) {
    const generateId = await this.videosService.addVideo(
      title,
      url_path,
      thumbnail,
      university,
      year,
      term,
      price,
      owner_id,
      description,
    );
    return { id: generateId };
  }

  @Get()
  async getvideos() {
    const videos = await this.videosService.getVideos();
    return videos;
  }

  // for Search page
  @Get('filters')
  async filterVideoById(
    @Query('university') university?: string,
    @Query('year') year?: string,
    @Query('term') term?: string,
  ) {
    const videos = await this.videosService.getFilteredVideo(
      university,
      year,
      term,
    );
    return videos;
  }

  @Get('search')
  async searchVideosByTitle(@Query('title') title: string) {
    const videos = await this.videosService.getSearchVideo(title);
    return videos;
  }
  // for Search page

  // get ownere for buying and watching page
  @Get('/owner/:id')
  async getOwnerByVideoId(@Param('id') id: string) {
    const owner_id = await this.videosService.getOwnerByVideoId(id);
    // console.log('owner_id',owner_id);
    return owner_id;
  }

  @Get('/:id')
  async getVideoById(@Param('id') id: string){
    const videos = await this.videosService.getVideoById(id);
    return videos;
  }

  @Patch(':id')
  async updateVideo(
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('university') university: string,
    @Body('year') year: string,
    @Body('term') term: string,
    @Body('price') price: number,
    @Body('description') description?: string,
  ) {
    await this.videosService.updateVideo(
      id,
      title,
      university,
      year,
      term,
      price,
      description,
    );
    return null;
  }

  @Delete('delete/:id')
  async deleteVideo(@Param('id') id: string) {
    try {
      const deletedVideo = await this.videosService.remove(id);
      if (!deletedVideo) {
        throw new NotFoundException(`Video with ID ${id} not found.`);
      }
      return deletedVideo;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting video', error);
    }
  }
}
