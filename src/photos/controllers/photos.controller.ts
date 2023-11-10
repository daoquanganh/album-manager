import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseIntPipe, Req, HttpException, HttpStatus, UseInterceptors, UploadedFile, ParseFilePipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from '../services/photos.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { PhotoInfoDto } from 'src/common/dtos/photos/photo-info.dto';
import { QueryDto } from 'src/common/dtos/photos/query.dto';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) { }

    @Post('upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() req: any, 
        @UploadedFile(ParseFilePipe) file: Express.Multer.File, 
        @Body() data: PhotoInfoDto) {
        console.log(file)
        return await this.photosService.create(req.user.id, file.path, data)
    }

    @Get()
    async findAll() {
        return await this.photosService.findAll()
    }

    @Patch(':id')
    async updatePhoto(@Req() req: any, @Param('id') id: string, @Body() data: PhotoInfoDto) {
        return await this.photosService.updatePhoto(req.user.id, id, data)
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deletePhoto(@Req() req: any, @Param('id') id: string) {
        return await this.photosService.deletePhoto(req.user.id, id)
    }

    @Get('pagination/')
    async pagination(@Query() query: QueryDto) {
        return await this.photosService.pagination(query)
    }

    @UseGuards(AuthGuard)
    @Post('addPhotoToAlbum')
    async addPhotoToAlbum(@Req() req: any, @Body() data: {photoId: string, albumId:string}){
        return await this.photosService.addPhotoToAlbum(req.user.id, data.photoId, data.albumId)
    }
}
