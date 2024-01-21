import "reflect-metadata"
import {DataSource} from "typeorm"
import {Post} from "../post/entity/Post.entity";
import {User} from "../auth/entity/User.entity";
import configObj from "../config"

const env = process.env.NODE_ENV as 'test' || 'development';
const config = configObj[env];

Object.assign(config, {
    entities: [Post, User],
    synchronize: true,
    logging: false,
});
export const AppDataSource = new DataSource(config);
