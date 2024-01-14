import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsEmail, IsNotEmpty, Length} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    @IsNotEmpty()
    @IsEmail()
    emailId!: string

    @Column()
    @IsNotEmpty()
    @Length(5, 20)
    password!: string

    @Column()
    @IsNotEmpty()
    @Length(1, 10)
    userName!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn()
    deletedAt!: Date;
}