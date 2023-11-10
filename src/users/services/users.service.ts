import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../common/dtos/users/update-user.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { ForgetPasswordDto } from 'src/common/dtos/users/forget-password.dto';
import { Photo } from 'src/entities/photo.entity';
import { Comment } from 'src/entities/comment.entity';
import { CommentDto } from 'src/common/dtos/users/comment.dto';
import { Album } from 'src/entities/album.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Photo) private photoRepo: Repository<Photo>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Album) private albumRepo: Repository<Album>,

  ) {}
  async create(data: CreateUserDto)  {
    return await this.userRepo.save(data)
  }

  async findAll() {
    return await this.userRepo.find({relations:['followers','followings', 'photos', 'albums']});
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
    let following = await this.userRepo.findOneBy({id:followingId})
    if (!following) throw new HttpException('Following user not found', HttpStatus.BAD_REQUEST)
    const result = (follower.followings).filter((element) => {
      return element.id == followingId
    })
    console.log(result)
    if (result.length != 0) {
      follower.followings = follower.followings.filter((element) => {
        return element.id != following.id
      })
    } else {
      follower.followings.push(following)
    }
    return this.userRepo.save(follower)
  }

  async likePhoto(userId: string, photoId: string) {
    const photo = await this.photoRepo.findOne({where: {id:photoId}})
    if (!photo) throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST)
    let user = await this.userRepo.findOne({
      where: {id:userId},
      relations: {likedPhotos:true}  
    })
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    const result = (user.likedPhotos).filter((element) => {
      return element.id == photoId
    })
    console.log(result)
    if (result.length == 0) {
      user.likedPhotos.push(photo)
      photo.like++
    } else {
      photo.like--
      user.likedPhotos = user.likedPhotos.filter((likedPhoto) => {
        return likedPhoto.id !== photo.id
      })
    }
    return Promise.all([this.userRepo.save(user), this.photoRepo.save(photo)])
  }

  async getNewsfeed(userId: string) {
    const user = await this.userRepo.findOne({
      where: {id: userId},
      relations: ['followings', 'followings.photos']
    })
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    const data =[]
    user.followings.forEach((following) => {
      following.photos.forEach((photo) => {
        data.push(photo)
      })
    })
    return data
  }
  async comment(data: CommentDto) {
    return await this.commentRepo.save(data)
  }

  async deleteUser(id: string) {
    let user = await this.userRepo.findOne({
      where: {id}
    })
    return await this.userRepo.remove(user)
  }

  async joinAlbum(userId:string, albumId: string) {
    let user = await this.userRepo.findOne({
      where: {id:userId}, 
      relations: {albums:true}
    })
    let album = await this.albumRepo.findOne({
      where: {id:albumId}
    })
    if (user && album) {
      user.albums.push(album)
      return await this.userRepo.save(user)
    } else throw new HttpException('User or Album not found', HttpStatus.NOT_FOUND)

  }
  //   let photo = await this.photoRepo.findOne({
  //     where: {id}, 
  //     relations: {owner:true}})
  // if (photo && photo.owner.id == userId) {
  //     fs.unlink(photo.link, (err) => {
  //         if (err) { 
  //             console.log(err)
  //         }
  //     })
  //     photo.owner.id = null
  //     return await this.photoRepo.remove(photo)
  // } else { throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST) }
}
