import express, {NextFunction, Request, Response, Router} from "express";
import {login, signUp} from "./auth.service";
import {UserDto} from "./dto/User.dto";

const authController: Router = express.Router();

authController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await login();
        res.status(200)
            .send('success');
    } catch (error) {
        next(error);
    }
});

// TODO 로그아웃
authController.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
});

authController.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDto = new UserDto()
            .setEmailId(req.body.emailId)
            .setPassword(req.body.password)
            .setUserName(req.body.userName);

        await signUp(userDto);
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