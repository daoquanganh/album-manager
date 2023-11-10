import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SaveUserDto } from 'src/common/dtos/users/save-user.dto';
import { LoginDto } from 'src/common/dtos/users/login.dto';
import { User } from 'src/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService) {}

  async validateUser(data: LoginDto): Promise<User> {
    let user = await this.usersService.findOneByEmail(data.login)
    if (!user) user = await this.usersService.findOneByUsername(data.login)
    else if (user.status === 'unverified') { throw new HttpException('Account is not verified', HttpStatus.FORBIDDEN)}

    if (user && bcrypt.compare(user.password, await bcrypt.hash(data.password, 10))) {
      return user
    }
  }

  async login(user: User) {
    if (user){
      const payload = { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          userName: user.userName,
          createdAt: user.createdAt, 
          updatedAt: user.updatedAt 
      }
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
  }

  async register(data: SaveUserDto) {
    data.password = await bcrypt.hash(data.password, 10)
    let otp = `${Math.floor(1000 + Math.random() * 9000)}`
    let response = await this.usersService.create({otp, ...data});
    if (response) {
      const { password, ...result } = response;
      return result;
    }
  }

  decodeToken(token: string) {
    const data = this.jwtService.decode(token)
    if (typeof data != 'string') return data
    throw new BadRequestException()
  }
}