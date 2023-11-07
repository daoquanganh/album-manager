import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Photo } from "./photo.entity";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsNotEmpty()
    @Column()
    userId: string

    @IsNotEmpty()
    @Column()
    photoId: string

    @IsNotEmpty()
    @Column()
    content: string

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Photo, (photo) => photo.comments)
    photo: Photo

}
