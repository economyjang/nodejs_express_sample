"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("./src/controllers/post"));
const app = (0, express_1.default)();
const port = 5100;
app.use(express_1.default.json());
app.use('/post', post_1.default);
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.send('Error');
});
app.listen(port, () => {
    console.log(`[Server] : Server is running at http://localhost:${port}`);
});
