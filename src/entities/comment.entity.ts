import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Photo } from "./photo.entity";
import { IsNotEmpty } from "class-validator";
import { CustomBaseEntity } from "src/common/base/base.entity";
import { MediaStatus } from "src/common/types/enum.type";

@Entity()
export class Comment extends CustomBaseEntity {

    @IsNotEmpty()
    @Column()
    userId: string

    @IsNotEmpty()
    @Column()
    photoId: string

    @IsNotEmpty()
    @Column()
    content: string

    @Column({
        type: 'enum',
        enum: ['public', 'private'],
        default: 'public',
    })
    status: MediaStatus

    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Photo, (photo) => photo.comments)
    photo: Photo

}
