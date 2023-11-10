import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MySQLConfigService } from './config/mysql.config';
import { PhotosModule } from './photos/photos.module';
import { AlbumsController } from './albums/controllers/albums.controller';
import { AlbumsService } from './albums/services/albums.service';
import { AlbumsModule } from './albums/albums.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      useClass: MySQLConfigService,
      inject: [MySQLConfigService]
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    PhotosModule,
    AlbumsModule,
    JwtModule,
    
  ],
  controllers: [AppController, AlbumsController],
  providers: [AppService, AlbumsService,    {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  }],
})
export class AppModule {}
