import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "src/common/entities/base.entity";
import { Album } from "./album.entity";
import { Photo } from "./photo.entity";
import { Comment } from "./comment.entity"
import { UserStatus } from "src/common/types/enum.type";
import { IsEmail, IsNotEmpty } from "class-validator";

@Entity()
export class User extends BaseEntity<UserStatus> {

    @PrimaryGeneratedColumn('uuid')
    id: string

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
    @JoinColumn({'name': 'followers', 'referencedColumnName': 'followerId'})
    albums: Album[]

    @OneToMany(() => Photo, (photo) => photo.user)
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
}