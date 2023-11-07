import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Photo } from "./photo.entity";

@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: number

    @Column()
    photoId: number

    @Column()
    content: number

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Photo, (photo) => photo.comments)
    photo: Photo

}
