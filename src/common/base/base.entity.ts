import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class CustomBaseEntity extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsNotEmpty()
    @Column()
    name: string;

    @CreateDateColumn({type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp' })
    updatedAt: Date;
}

