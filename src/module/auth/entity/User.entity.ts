import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsEmail, IsEmpty, IsNotEmpty, Length} from "class-validator";
import {LoginHistory} from "./LoginHistory.entity";

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

    @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.user)
    loginHistory!: LoginHistory[]

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn()
    deletedAt!: Date;
}