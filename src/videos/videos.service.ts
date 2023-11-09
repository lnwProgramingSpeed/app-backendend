import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './video.model';

@Injectable()
export class VideosService {
  constructor(@InjectModel('Video') private videoModel: Model<VideoDocument>) {} // Video model created by mongoose

  async addVideo(
    title: string,
    url_path: Object,
    thumbnail: string,
    university: string,
    year: string,
    term: string,
    price: number,
    owner_id: string,
    description?: string,
  ) {
    const currentDate = new Date();
    const buyTime: number = 0;
    const newVideo = new this.videoModel({
      title,
      description,
      url_path,
      thumbnail,
      university,
      year,
      term,
      price,
      date: currentDate,
      buyTime: buyTime,
      owner_id,
    });
    const result = await newVideo.save();
    return result.id as string;
  }

  async getVideos() {
    const videos = await this.videoModel.find().exec();
    return videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url_path: video.url_path,
      thumbnail: video.thumbnail,
      university: video.university,
      year: video.year,
      term: video.term,
      price: video.price,
      owner_id: video.owner_id,
      buyTime: video.buyTime,
      date: video.date,
    }));
  }

  async getVideoById(id: string) {
    try {
      const video = await this.videoModel.findById(id).exec();
      if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
      return {
        id: video.id,
        title: video.title,
        description: video.description,
        url_path: video.url_path,
        thumbnail: video.thumbnail,
        university: video.university,
        year: video.year,
        term: video.term,
        price: video.price,
        date: video.date,
        buyTime: video.buyTime,
        owner_id: video.owner_id,
      };
    } catch (error) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }

  async updateVideo(
    id: string,
    title: string,
    university: string,
    year: string,
    term: string,
    price: number,
    description: string,
  ) {
    const updateData: Partial<Video> = {};

    if (title) updateData.title = title;
    if (university) updateData.university = university;
    if (year) updateData.year = year;
    if (term) updateData.term = term;
    if (price) updateData.price = price;
    if (description) updateData.description = description;

    const updatedVideo = await this.videoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return updatedVideo;
  }

  async deleteVideo(id: string) {
    const result = await this.videoModel.deleteOne({ _id: id }).exec();
  }

  async getOwnerByVideoId(id: string): Promise<Video> {
    const owner_id = await this.findOwner(id);
    return owner_id;
  }

  private async findOwner(id: string): Promise<Video> {
    let video;
    try {
      video = await this.videoModel.findById(id);
    } catch (err) {
      throw new NotFoundException('Doko ni arimasu ka?');
    }
    if (!video) {
      throw new NotFoundException('Doko ni arimasu ka?');
    }
    return video.owner_id;
  }

  // for Search page
  async getFilteredVideo(university: string, year: string, term: string) {
    const result = await this.filter(university, year, term);
    return result;
  }

  private async filter(
    university?: string,
    year?: string,
    term?: string,
  ): Promise<Video[]> {
    let videos;
    try {
      const query: {
        university?: string;
        year?: string;
        term?: string;
      } = {};

      if (university) query.university = university;
      if (year) query.year = year;
      if (term) query.term = term;

      // Use the query to find matching videos
      videos = await this.videoModel.find(query);

      if (!videos || videos.length === 0) {
        throw new NotFoundException('No matching videos found');
      }
    } catch (err) {
      throw new NotFoundException('Doko ni arimasu ka?');
    }

    return videos;
  }

  async getSearchVideo(search: string): Promise<Video[]> {
    const result = await this.search(search);
    return result;
  }

  private async search(search: string): Promise<Video[]> {
    const regex = new RegExp(search, 'i'); // 'i' makes the search case-insensitive

    const videos = await this.videoModel.find({ title: regex }).exec();

    return videos;
  }
  // for Search page

  // My video page
  async findMyVideo(user_id: string): Promise<Video[]> {
    const videos = await this.videoModel.find({ owner_id: user_id }).exec();
    return videos;
  }

  async remove(id: string): Promise<Video> {
    try {
      const deletedVideo = await this.videoModel.findByIdAndRemove(id);
      if (!deletedVideo) {
        throw new NotFoundException(`Video with ID ${id} not found.`);
      }
      return deletedVideo;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting video', error);
    }
  }

  async buy(id: string) {
    try {
      const video = await this.videoModel.findById(id);
      if (video) {
        video.buyTime += 1;

        await video.save();

        return video;
      } else {
        console.error('Video not found');
        return null;
      }
    } catch (error) {
      console.error('Error updating buyTime:', error);
      throw error;
    }
  }
  async editVideo(
    id: string,
    title: string,
    university: string,
    year: string,
    term: string,
    price: number,
    description: string,
  ) {
    const updateData: Partial<Video> = {};

    if (title) updateData.title = title;
    if (university) updateData.university = university;
    if (year) updateData.year = year;
    if (term) updateData.term = term;
    if (price) updateData.price = price;
    if (description) updateData.description = description;

    const updatedVideo = await this.videoModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return updatedVideo;
  }
}
