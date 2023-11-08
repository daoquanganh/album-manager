import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Album } from 'src/entities/album.entity';
import { AlbumInfoDto } from 'src/common/dtos/albums/album-info.dto';

@Injectable()
export class AlbumsService {

    constructor(    
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Album) private albumRepo: Repository<Album>
    ) {}
    async create(id: string, link: string, data: AlbumInfoDto) {
        const user = await this.userRepo.findOne({
            where: {id}, 
            relations: {
                albums: true
            }
        })
        if (!user) throw new HttpException('Cant extract user from token', HttpStatus.BAD_REQUEST)
        const albumInfo = await this.albumRepo.save({...data, link})
        user.albums.push(albumInfo)
        await this.userRepo.save(user)
        return albumInfo
    }

    findAll() {
        return this.albumRepo.find()
    }

    async updateAlbum(id: string, data: AlbumInfoDto) {
        let album = await this.albumRepo.findOneBy({id})
        if (album) {
            album.name = data.name
            album.description = data.description
            album.status = data.status
            return await this.albumRepo.save(album)
        } else { throw new HttpException('Album not found', HttpStatus.BAD_REQUEST) }
    }
    
    async deleteAlbum(id: string) {
        let album = await this.albumRepo.findOne({
            where: {id}, 
            relations: ['users','photos']})
        if (album) {
            fs.unlink(album.link, (err) => {
                if (err) { 
                    console.log(err)
                }
            })
            album.photos = null
            album.users = null
            return await this.albumRepo.remove(album)
        } else { throw new HttpException('Album not found', HttpStatus.BAD_REQUEST) }
    }

    
}
