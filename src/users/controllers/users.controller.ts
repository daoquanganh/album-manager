import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe } from '@nestjs/common';
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
  async updateUserInfo(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return await this.usersService.updateUser(id, data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.usersService.findOne(+id);
  }

  // @Post('follow')
  // async followUser()

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
