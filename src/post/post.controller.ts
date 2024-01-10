import express, {Router, Request, Response, NextFunction} from "express";
import {createPost, deletePost, getPost, getPosts, updatePost} from './post.service';

const postController: Router = express.Router();

postController.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPosts();
    res.status(200)
        .json(result);
});

postController.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    await createPost(req.body);
    res.status(200)
        .send('success');
});

postController.get('/:postId', async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPost(req.params.postId);
    res.status(200)
        .json(result);
});

postController.post('/update', async (req: Request, res: Response, next: NextFunction) => {
   const result = await updatePost(req.body);
   res.status(200)
       .send('success');
});

postController.post('/delete', async (req: Request, res: Response, next: NextFunction) => {
    await deletePost(req.body);
    res.status(200)
        .send('success');
});

export default postController;