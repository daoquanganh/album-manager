import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Album } from "./album.entity";
import { Photo } from "./photo.entity";
import { Comment } from "./comment.entity"
import { UserStatus } from "src/common/types/enum.type";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Follower } from "./follower.entity";

@Entity()
export class User extends BaseEntity<UserStatus> {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @IsNotEmpty()
    @Column()
    name: string

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

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => Follower, follows => follows.following)
    followers: Follower[];
    
    @OneToMany(() => Follower, follows => follows.follower)
    followings: Follower[];
}