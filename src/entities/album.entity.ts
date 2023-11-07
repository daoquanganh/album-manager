import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { MediaStatus } from "src/common/types/enum.type";
import { Photo } from "./photo.entity";
import { IsNotEmpty } from "class-validator";
import { User } from "./user.entity";

@Entity()
export class Album extends BaseEntity<MediaStatus> {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsNotEmpty()
    @Column()
    description: string

    @IsNotEmpty()
    @Column()
    link: string

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    })
    status: MediaStatus

    @OneToMany(() => Photo, (photo) => photo.album)
    photos: Photo[]

    @ManyToMany(() => User, (user) => user.albums)
    users: User[]
}
