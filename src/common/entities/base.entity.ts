import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity<T extends string> {

    @Column()
    name: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @Column()
    status: T;
}

