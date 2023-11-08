import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/entities/photo.entity';
import { PhotosController } from './controllers/photos.controller';
import { PhotosService } from './services/photos.service';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/multer.config';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([Photo]), 
      JwtModule, 
      UsersModule,
      AlbumsModule,
      MulterModule.registerAsync({
        useClass: MulterConfigService
    })],
    controllers: [PhotosController],
    providers: [PhotosService],
    exports:[PhotosService, TypeOrmModule]
  })
export class PhotosModule {}
