import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Follower extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: number

    //USER who follows
    @ManyToOne(() => User, (user) => user.followings)
    follower: User[];
    
    //USER who gets a follower
    @ManyToOne(() => User, (user) => user.followers)
    following: User[];
}
