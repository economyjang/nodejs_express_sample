"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Post_1 = require("../post/entity/Post");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "admin1234",
    database: "nodejs_sample_db",
    entities: [Post_1.Post],
    synchronize: true,
    logging: false,
});
//# sourceMappingURL=index.js.map