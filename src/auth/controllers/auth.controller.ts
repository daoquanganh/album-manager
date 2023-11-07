import { Controller, Request, Post, UseGuards, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { VerifyUserDto } from 'src/common/dtos/users/verify-user.dto';
import { LoginDto } from 'src/common/dtos/users/login.dto';
import { AuthGuard } from '../guards/local-auth.guard';
import * as bcrypt from 'bcrypt'
import { UserInfoDto } from 'src/common/dtos/users/user-info.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService) {}
    
    @Post('login')
    async login(@Body() data: LoginDto) {
        const user = await this.authService.validateUser(data)
        return await this.authService.login(user);
    }

    @Post('register')
    async register(@Body() data: UserInfoDto) {
        const duplicateUsername = await this.userService.findOneByUsername(data.userName)
        const duplicateEmail = await this.userService.findOneByEmail(data.email)
        if ( duplicateEmail ) throw new HttpException('Duplicated email', HttpStatus.BAD_REQUEST)
        else if ( duplicateUsername ) throw new HttpException('Duplicated username', HttpStatus.BAD_REQUEST)
        else {
            return this.authService.register({status: 'unverified', ...data})
        }
    }

    @Post('verify')
    async verify(@Body() data: VerifyUserDto) {
        let email = data.email
        let otp = data.otp
        if (!email) {
            throw new HttpException('Empty user email', HttpStatus.BAD_REQUEST)
        } else if (!otp) {
            throw new HttpException('Empty otp input', HttpStatus.BAD_REQUEST)
        } else {
            const user = await this.userService.findOneByEmail(email)
            if (otp != user.otp) { throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST)}
            else {
                const userUpdate = await this.userService.updateStatus(user.id)
                return userUpdate
            }
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}