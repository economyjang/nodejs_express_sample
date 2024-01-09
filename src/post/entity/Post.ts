import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    subject!: string

    @Column()
    content!: string

    @Column()
    author!: string

    @CreateDateColumn()
    created_at!: Date
}