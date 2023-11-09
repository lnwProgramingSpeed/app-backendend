import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';

import * as bcrypt from 'bcrypt';

import { Video } from '../videos/video.model';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private videosService: VideosService,
  ) {}

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
    }));
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
    purchaseVideos: string[],
  ): Promise<User> {
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const profilePicture: string = 'profilePicture';

    // Create a new user with the hashed password
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      purchaseVideos,
      profilePicture,
    });
    return await newUser.save();
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // My Video Page
  async findMyVideos(user_id: string): Promise<Video[]> {
    return this.videosService.findMyVideo(user_id);
  }

  async changeProfilePicture(user_id: string, profilePicture: string) {
    try {
      const user = await this.userModel.findById(user_id).exec();
      if (!user) {
        throw new Error(`User with ID ${user_id} not found`);
      }

      user.profilePicture = profilePicture; // Set the profile picture data as a Buffer
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error changing profile picture: ${error.message}`);
    }
  }

  async getUserProfilePicture(user_id: string): Promise<string | null> {
    try {
      const user = await this.userModel.findById(user_id).exec();

      if (!user) {
        throw new Error(`User with ID ${user_id} not found`);
      }

      const profilePictureUrl = user.profilePicture;
      return profilePictureUrl;
    } catch (error) {
      throw new Error(`Error fetching user profile picture: ${error.message}`);
    }
  }

  //Buying Page
  async findOwner(user_id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: user_id }).exec();
      if (!user) {
        throw new Error(`User with ID ${user_id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  // QR Page
  async getPurchase(user_id: string) {
    try {
      const user = await this.userModel.findOne({ _id: user_id }).exec(); // find which user is calling
      if (!user) throw new Error(`User with ID ${user_id} not found`); // Check if user exist

      const purchasedVideos: Video[] = []; // Create new arrau for storing list

      for (const videoId of user.purchaseVideos) {
        const video = await this.videosService.getVideoById(videoId); // get each video using its id
        if (video) {
          purchasedVideos.push(video); // push in list
        }
      }

      return purchasedVideos; // then return;
    } catch (error) {
      throw new Error(
        `Error fetching user's purchased videos: ${error.message}`,
      );
    }
  }

  async purchase(user_id: string, video_id: string) {
    try {
      const user = await this.userModel.findOne({ _id: user_id }).exec();
      const video = await this.videosService.getVideoById(video_id);
      if (video) {
        if (video.owner_id === user_id) {
          return true;
        }
      }
      if (user) {
        // Check if the video_id is already in the purchaseVideos array
        if (user.purchaseVideos.includes(video_id)) {
          return true; // already in the purchaseVideos array
        }

        user.purchaseVideos.push(video_id);
        await user.save();
        return false; // not in purchase
      }
    } catch (error) {
      throw new Error('Error purchasing video: ' + error.message);
    }
  }

  async updateName(user_id: string, newName: string) {
    try {
      const user = await this.userModel.findById(user_id);

      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      user.username = newName;

      await user.save();

      return { message: 'Name updated successfully' };
    } catch (error) {
      throw new Error('Error updating name: ' + error.message);
    }
  }

  async updatePassword(user_id: string, newPassword: string) {
    try {
      const user = await this.userModel.findById(user_id);

      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      const saltRounds = 10; // You can adjust the number of salt rounds
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;

      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error('Error updating password: ' + error.message);
    }
  }
}
