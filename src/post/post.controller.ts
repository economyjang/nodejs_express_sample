import express, {Router, Request, Response, NextFunction} from "express";
import {createPost, getPost} from './post.service';

const controller: Router = express.Router();

controller.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    await createPost(req.body);
    res.status(200)
        .send('success');
});

controller.get('/:postId', async (req: Request, res: Response, next: NextFunction) => {
    const result = await getPost(req.params.postId);
    res.status(200)
        .json(result);
});

export default controller;