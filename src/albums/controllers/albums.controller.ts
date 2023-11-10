import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AlbumsService } from '../services/albums.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlbumInfoDto } from 'src/common/dtos/albums/album-info.dto';
import { diskStorage } from 'multer';
import {extname} from 'path';

@Controller('albums')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) { }

    @Post('upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', {storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            cb(null, Date.now() + extname(file.originalname))
        }
    })}))
    async uploadFile(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Body() data: AlbumInfoDto) {
        console.log(file)
        return await this.albumsService.create(req.user.id, file.path, data)
    }

    @Get()
    async findAll() {
        return await this.albumsService.findAll()
    }

    @Patch('update/:id')
    async updateAlbum(@Param('id') id: string, @Body() data: AlbumInfoDto) {
        return await this.albumsService.updateAlbum(id, data)
    }

    @Delete('delete/:id')
    async deleteAlbum(@Param('id') id: string) {
        return await this.albumsService.deleteAlbum(id)
    }
}
