import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from 'src/entities/album.entity';
import { UsersModule } from 'src/users/users.module';
import { AlbumsController } from './controllers/albums.controller';
import { AlbumsService } from './services/albums.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/config/multer.config';

@Module({
    imports: [
      MulterModule.registerAsync({
        useClass: MulterConfigService}),
      TypeOrmModule.forFeature([Album]), 
      JwtModule, 
      UsersModule,
    ],
    controllers: [AlbumsController],
    providers: [AlbumsService],
    exports:[AlbumsService, TypeOrmModule]
  })
export class AlbumsModule {}
