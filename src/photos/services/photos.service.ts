import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoInfoDto } from 'src/common/dtos/photos/photo-info.dto';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import * as fs from 'fs';
import { QueryDto } from 'src/common/dtos/photos/query.dto';
import { Album } from 'src/entities/album.entity';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class PhotosService extends BaseService<Photo>{

    constructor(    
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Photo) private photoRepo: Repository<Photo>,
        @InjectRepository(Album) private albumRepo: Repository<Album>
    ) {
        super(photoRepo);
    }
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

    async updatePhoto(userId:string, id: string, data: PhotoInfoDto) {
        let photo = await this.photoRepo.findOneBy({id})

        if (photo) {
            if (userId !== photo.owner.id) throw new HttpException('You are not the owner of this photo', HttpStatus.FORBIDDEN)
            photo.name = data.name
            photo.description = data.description
            photo.status = data.status
            return await this.photoRepo.save(photo)
        } else { throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST) }
    }
    
    async deletePhoto(userId: string, id: string) {
        let photo = await this.photoRepo.findOne({
            where: {id}, 
            relations: {owner:true}})
        if (photo && photo.owner.id == userId) {
            fs.unlink(photo.link, (err) => {
                if (err) { 
                    console.log(err)
                }
            })
            photo.owner.id = null
            return await this.photoRepo.remove(photo)
        } else { throw new HttpException('Photo not found', HttpStatus.BAD_REQUEST) }
    }

    async pagination(query: QueryDto) {
        const order = query.order || 'ASC'
        const filter = query.filter || 'createdAt'
        const minLike = query.minLike || 0
        const [results, total] = await this.photoRepo.findAndCount({
            skip: 10*(query.page-1),
            take: 10,
            order: {
                [filter]: order === 'DESC' ? 'DESC' : 'ASC',
            },
            where: {
                like: MoreThanOrEqual(minLike)
            }
        })
        return {data:results, total}
    }

    async addPhotoToAlbum(userId: string, photoId:string, albumId: string) {
        const photo = await this.photoRepo.findOne({
            where: {id: photoId},
            relations: {owner:true}     
        })
        if (!photo) throw new HttpException('Photo not found', HttpStatus.NOT_FOUND)
        if (userId != photo.owner.id) throw new HttpException('You are not the owner of the photo', HttpStatus.FORBIDDEN)
        
        const album = await this.albumRepo.findOneBy({id: albumId})
        if (!album) throw new HttpException('Album not found', HttpStatus.NOT_FOUND)
        photo.album = album
        await this.photoRepo.save(photo)
        
        const user = await this.userRepo.findOne({
            where: {id: userId},
            relations: {albums:true}
        })
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        const result = (user.albums).filter((element) => {
            return element.id == albumId
          })
        if (result) {
            return photo
        }
        user.albums.push(album)
        return await this.userRepo.save(user)
    }
}
