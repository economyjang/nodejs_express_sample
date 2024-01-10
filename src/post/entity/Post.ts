import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    subject!: string

    @Column()
    content!: string

    @Column()
    authorId!: string

    @Column()
    author!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updateAt!: Date

    @DeleteDateColumn()
    deleteAt!: Date
}