import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { User } from "./user.entity";
import { MediaStatus } from "src/common/types/enum.type";
import { Album } from "./album.entity";
@Entity()
export class Photo extends BaseEntity<MediaStatus> {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    description: string

    @Column({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    })
    status: MediaStatus

    @Column()
    like: number

    @ManyToOne(() => User, (user) => user.photos)
    user: User

    @ManyToOne(() => Album, (album) => album.photos)
    album: Album
}
