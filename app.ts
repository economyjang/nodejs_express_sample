import express, {Express, NextFunction, Request, Response} from 'express';
import authController from './src/auth/auth.controller';
import postController from './src/post/post.controller'
import {AppDataSource} from "./src/data-source";
import {ICustomError} from "./types/ICustiomError.interface";

const app: Express = express();
// TODO configuration 에 넣기
const port = 5100;

// TODO morgan 미들웨어 적용

// 데이터소스
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log('Database Connection Success!');
    })
    .catch((error) => console.log(error));

app.use(express.json());

// 컨트롤러 라우팅
app.use('/auth', authController);
app.use('/post', postController);

// 엔드포인트가 없을 때 에러
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`${req.method} ${req.url} 엔드포인트가 없습니다.`) as ICustomError;
    error.status = 404;
    next(error);
});

app.use((err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500);
    res.send({message: err.message});
});

app.listen(port, () => {
    console.log(`[Server] : Server is running at http://localhost:${port}`);
});
