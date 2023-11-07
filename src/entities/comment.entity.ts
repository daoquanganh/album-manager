import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    content: string

    @Column()
    like: number

    @ManyToOne(() => User, (user) => user.comments)
    user: User

}
