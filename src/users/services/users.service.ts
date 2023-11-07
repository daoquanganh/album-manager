import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../common/dtos/users/update-user.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { ForgetPasswordDto } from 'src/common/dtos/users/forget-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async create(data: CreateUserDto)  {
    return await this.userRepo.save(data)
  }

  async findAll() {
    return await this.userRepo.find({relations:{followers:true,followings:true, photos:true}});
  }

  async findOneByUsername(userName: string): Promise<User | undefined> {
    return await this.userRepo.findOne({where: {userName}})
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepo.findOne({where: {email}})
  }

  async findOneById(id: string): Promise<User | undefined> {
    return await this.userRepo.findOne({where: {id}})
  }

  async updatePassword(data: ForgetPasswordDto) {
    if (!data.email) {throw new HttpException('Empty user email', HttpStatus.BAD_REQUEST)}
    else if (!data.password) {throw new HttpException('New password cannot be empty', HttpStatus.BAD_REQUEST)}

    const user =  await this.findOneByEmail(data.email)
    if (!user) {throw new HttpException('No users with specified email', HttpStatus.BAD_REQUEST)}
    else {
      data.password = await bcrypt.hash(data.password, 10)
      user.password = data.password
      return await this.userRepo.save(user)
    }
  }
  async updateStatus(id: string) {
    let user = await this.userRepo.findOneBy({id})
    if (user) {
      user.status = 'verified'
      user.otp = ''
      return await this.userRepo.save(user)
    } else { throw new HttpException('User not found', HttpStatus.BAD_REQUEST)}
  }
  async updateUser(id: string, data: UpdateUserDto) {
    let user = await this.userRepo.findOneBy({id})
    if (user) {
      user.name = data.name
      user.userName = data.userName
      user.email = data.email
      return await this.userRepo.save(user)
    } else { throw new HttpException('User not found', HttpStatus.BAD_REQUEST) }
  }

  async follow(followerId: string, followingId: string) {
    let follower = await this.userRepo.findOne({
      where: {id:followerId}, 
      relations: {
        followings:true
      }})
    let following = await this.findOneById(followingId)
    if (!following) throw new HttpException('Following user not found', HttpStatus.BAD_REQUEST)
    follower.followings.push(following)
    return this.userRepo.save(follower)
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
