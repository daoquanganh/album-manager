import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "src/common/base/base.entity";
import { User } from "./user.entity";
import { MediaStatus } from "src/common/types/enum.type";
import { Album } from "./album.entity";
import { IsNotEmpty } from "class-validator";
import { Comment } from "./comment.entity";
@Entity()
export class Photo extends CustomBaseEntity {

    @IsNotEmpty()
    @Column()
    description: string

    @IsNotEmpty()
    @Column()
    link: string

    @Column({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    })
    status: MediaStatus

    @Column({default: 0})
    like: number

    @ManyToOne(() => User, (user) => user.photos, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    owner: User

    @ManyToOne(() => Album, (album) => album.photos)
    album: Album

    @OneToMany(() => Comment, (comment) => comment.photo, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    comments: Comment[]

}
