import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe, Req, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../common/dtos/users/update-user.dto';
import { ForgetPasswordDto } from 'src/common/dtos/users/forget-password.dto';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('reset')
  async resetPassword(@Body() data: ForgetPasswordDto) {
    return await this.usersService.updatePassword(data)
  }
  
  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async updateUserInfo(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return await this.usersService.updateUser(id, data)
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   // return this.usersService.findOne(+id);
  // }

  @UseGuards(AuthGuard)
  @Post('follow')
  async followUser(@Req() req:any, @Body() followingId: string ) {
    const followerId = req.user.data.id
    if (!followerId) throw new BadRequestException('Cant extract userId from token')
    return await this.usersService.follow(followerId, followingId)
  }

  @UseGuards(AuthGuard)
  @Post('like')
  async likePhoto(@Req() req:any, @Body() data: {photoId: string} ) {
    const userId = req.user.data.id
    if (!userId) throw new BadRequestException('Cant extract userId from token')
    return await this.usersService.likePhoto(userId, data.photoId)
  }

  @UseGuards(AuthGuard)
  @Get('newsfeed')
  async getNewsfeed(@Req() req:any) {
    const userId = req.user.data.id
    if (!userId) throw new BadRequestException('Cant extract userId from token')
    return await this.usersService.getNewsfeed(userId)
  }

  @UseGuards(AuthGuard)
  @Post('comment')
  async comment(@Req() req:any, @Body() data: {content: string, photoId: string}) {
    const userId = req.user.data.id
    if (!userId) throw new BadRequestException('Cant extract userId from token')
    return await this.usersService.comment({userId, ...data})
  }
}
