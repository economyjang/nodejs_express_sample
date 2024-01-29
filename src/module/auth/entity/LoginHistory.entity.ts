import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User.entity";

@Entity()
export class LoginHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    refreshToken!: string

    @ManyToOne(() => User, (user) => user.loginHistory)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn()
    deletedAt!: Date;
}