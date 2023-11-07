import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Album } from "src/entities/album.entity";
import { Comment } from "src/entities/comment.entity";
import { Photo } from "src/entities/photo.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class MySQLConfigService implements TypeOrmOptionsFactory {

    constructor( private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USERNAME'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [User, Album, Photo, Comment],
            synchronize: true,
        }    
    }
}