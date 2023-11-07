import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoInfoDto } from 'src/common/dtos/photos/photo-info.dto';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class PhotosService {

    constructor(    
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Photo) private photoRepo: Repository<Photo>
    ) {}
    async create(id: string, link: string, data: PhotoInfoDto) {
        const user = await this.userRepo.findOne({
            where: {id}, 
            relations: {
                photos: true
            }
        })
        if (!user) throw new HttpException('Cant extract user from token', HttpStatus.BAD_REQUEST)
        const photoInfo = await this.photoRepo.save({...data, link})
        user.photos.push(photoInfo)
        await this.userRepo.save(user)
        return photoInfo
    }

    findAll() {
        return this.photoRepo.find()
    }

    async updatePhoto(id: string, data: PhotoInfoDto) {
        let photo = await this.photoRepo.findOneBy({id})
        if (photo) {
            photo.name = data.name
            photo.description = data.description
            photo.status = data.status
            return await this.photoRepo.save(photo)
        } else { throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST) }
    }
    
    async deletePhoto(id: string) {
        let photo = await this.photoRepo.findOne({
            where: {id}, 
            relations: {owner:true}})
        if (photo) {
            fs.unlink(photo.link, (err) => {
                if (err) { 
                    console.log(err)
                }
            })
            photo.owner.id = null
            return await this.photoRepo.remove(photo)
        } else { throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST) }
    }

    async pagination(page: number) {
        return await this.photoRepo.find({
            skip: 10*(page-1),
            take: 10
        })

    }


}
