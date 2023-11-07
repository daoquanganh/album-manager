import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Photo } from 'src/entities/photo.entity';
import { Album } from 'src/entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Photo, Album]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService, TypeOrmModule]
})
export class UsersModule {}
