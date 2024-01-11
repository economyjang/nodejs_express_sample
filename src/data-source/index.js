"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Post_1 = require("../post/entity/Post");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "admin1234",
    database: "nodejs_sample_db",
    entities: [Post_1.Post],
    synchronize: true,
    logging: true,
});
