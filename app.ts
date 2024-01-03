import express, {Express, NextFunction, Request, Response} from 'express';
import postController from './src/controllers/post';

const app: Express = express();
const port = 5100;

app.use(express.json());

app.use('/post', postController);

app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500);
    res.send('Error');
})

app.listen(port, () => {
    console.log(`[Server] : Server is running at http://localhost:${port}`);
})
