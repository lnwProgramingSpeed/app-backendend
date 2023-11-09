import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

import { VideosService } from '../videos/videos.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private readonly videosService: VideosService,
  ) {}

  @Get('')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get('check-email')
  async checkEmailExist(@Query('email') email: string) {
    const emailExists = await this.userService.emailExists(email);
    return emailExists;
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const purchaseVideos: string[] = [];
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    return this.userService.registerUser(
      username,
      email,
      password,
      purchaseVideos,
    );
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // Compare hashed password from the database with the provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }
    throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
  }

  @Get('myvideo/:user_id')
  async findMyVideo(@Param('user_id') user_id: string) {
    return this.videosService.findMyVideo(user_id);
  }

  @Get(':owner_id')
  async findOwner(@Param('owner_id') owner_id: string) {
    return this.userService.findOwner(owner_id);
  }

  @Post('purchase/:user_id/:video_id')
  async purchase(
    @Param('user_id') owner_id: string,
    @Param('video_id') video_id: string,
  ) {
    try {
      const result = await this.userService.purchase(owner_id, video_id);
      return result;
    } catch (error) {
      throw new Error(`Error purchasing video: ${error.message}`);
    }
  }

  @Get('purchase/:user_id')
  async getPurchase(@Param('user_id') user_id: string) {
    try {
      return await this.userService.getPurchase(user_id);
    } catch (error) {
      throw new Error(
        `Error fetching user's purchased videos: ${error.message}`,
      );
    }
  }

  @Put('changeProfilePicture/:user_id')
  async changeProfilePicture(
    @Param('user_id') user_id: string,
    @Body('profilePicture') profilePicture: string,
  ) {
    return this.userService.changeProfilePicture(user_id, profilePicture);
  }

  @Get('getProfilePicture/:user_id')
  async getProfilePicture(@Param('user_id') user_id: string) {
    return this.userService.getUserProfilePicture(user_id);
  }

  @Put('update/:user_id')
  async updateName(
    @Param('user_id') user_id: string,
    @Body('newName') newName: string,
  ) {
    return this.userService.updateName(user_id, newName);
  }

  @Put('updatePassword/:user_id')
  async updatePassword(
    @Param('user_id') user_id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.userService.updatePassword(user_id, newPassword);
  }
}
