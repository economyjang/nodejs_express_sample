import express, {Router, Request, Response, NextFunction} from "express";
import {createPost} from "../services/post";

const controller: Router = express.Router();

controller.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const result = await createPost(req.body);
    res.send(result);
});

export default controller;