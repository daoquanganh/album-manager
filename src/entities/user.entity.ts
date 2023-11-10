import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "src/common/base/base.entity";
import { Album } from "./album.entity";
import { Photo } from "./photo.entity";
import { Comment } from "./comment.entity"
import { UserStatus } from "src/common/types/enum.type";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class User extends CustomBaseEntity {

    @IsNotEmpty()
    @Column({ unique: true })
    userName: string
    
    @IsNotEmpty()
    @Column()
    password: string

    @Column()
    otp: string

    @IsEmail()
    @IsNotEmpty()
    @Column({ unique: true })
    email: string

    @IsNotEmpty()
    @Column({
        type: 'enum',
        enum: ['verified', 'unverified'],
        default: 'verified',
    })
    status: UserStatus

    @ManyToMany(() => Album)
    @JoinTable()
    albums: Album[]

    @OneToMany(() => Photo, (photo) => photo.owner)
    photos: Photo[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @ManyToMany(() => User, (user) => user.followings)
    @JoinTable({
        'name': 'followers', 
        'joinColumn':{
            name: 'follower',
            referencedColumnName: 'id'
        },
        'inverseJoinColumn': {
            name: 'following',
            referencedColumnName: 'id'
        }})
    followers: User[];

    @ManyToMany(() => User, (user) => user.followers)
    followings: User[];

    @ManyToMany(() => Photo)
    @JoinTable()
    likedPhotos: Photo[]
}