import express, {NextFunction, Request, Response, Router} from "express";
import {signUp} from "./auth.service";
import {UserDto} from "./dto/User.dto";
import passport from "passport";
import {User} from "./entity/User.entity";
import {CustomError} from "../common/CustomError";

const authController: Router = express.Router();

authController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error: Error | null, user: User | boolean, info: { message: string } | undefined) => {
        if (error) {
            next(error);
        }

        if(info) {
            next(new CustomError(409, info.message));
        }

        if(user) {
            // JWT token 발급
            res.status(200)
                .send('success');
        }
    })(req, res, next);
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