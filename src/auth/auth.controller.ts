import express, {NextFunction, Request, Response, Router} from "express";
import {signUp} from "./auth.service";

const authController: Router = express.Router();

// TODO 로그인
authController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
});

// TODO 로그아웃
authController.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
});

// TODO 회원가입
authController.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try  {
        await signUp(req.body);
        res.status(200)
            .send('success');
    } catch (error) {
        next(error);
    }
});

// TODO JWT 토큰 재발급
authController.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
});

// TODO 비밀번호 재설정
authController.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
});

export default authController;