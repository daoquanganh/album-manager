import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { MediaStatus } from "src/common/types/enum.type";
import { Photo } from "./photo.entity";

@Entity()
export class Album extends BaseEntity<MediaStatus> {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    description: string

    @Column()
    link: string

    @Column({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    })
    status: MediaStatus

    @OneToMany(() => Photo, (photo) => photo.album)
    photos: Photo[]
}
