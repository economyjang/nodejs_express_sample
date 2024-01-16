import "reflect-metadata"
import {DataSource} from "typeorm"
import {Post} from "../post/entity/Post.entity";
import {User} from "../auth/entity/User.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "rsdroot@0705",
    database: "nodejs_express",
    entities: [Post, User],
    synchronize: true,
    logging: true,
});