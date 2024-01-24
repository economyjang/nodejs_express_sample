import express, {Express, NextFunction, Request, Response} from 'express';
import authController from './src/module/auth/auth.controller';
import postController from './src/module/post/post.controller'
import Passport from "./src/passport"
import passport from "passport";
import {AppDataSource} from "./src/data-source";
import {CustomError} from "./src/common/CustomError";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app: Express = express();
const port = 5100;

// morgan
app.use(morgan('dev'));

// Passport
Passport();
app.use(passport.initialize());

// 데이터소스
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log('Database Connection Success!');
    })
    .catch((error) => console.log(error));

app.use(express.json());
app.use(cookieParser());

// 컨트롤러 라우팅
app.use('/auth', authController);
app.use('/post', postController);

// 엔드포인트가 없을 때 에러
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError(404, `${req.method} ${req.url} 엔드포인트가 없습니다.`);
    next(error);
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.getStatus() || 500);
    res.send({message: err.getMessage()});
});

app.listen(port, () => {
    console.log(`[Server] : Server is running at http://localhost:${port}`);
});

export default app;