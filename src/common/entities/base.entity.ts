import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity<T extends string> {

    @IsNotEmpty()
    @Column({default: ''})
    name: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column()
    status: T;
}

