import "reflect-metadata"
import {DataSource} from "typeorm"
import {Post} from "../post/entity/Post.entity";
import {User} from "../auth/entity/User.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "admin1234",
    database: "nodejs_sample_db",
    entities: [Post, User],
    synchronize: true,
    logging: true,
});