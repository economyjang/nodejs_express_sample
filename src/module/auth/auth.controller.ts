import passport from "passport";
import express, {NextFunction, Request, Response, Router} from "express";
import {issueJwt, issueRefreshToken, reissueJwtToken, resetPassword, signUp} from "./auth.service";
import {UserDto} from "./dto/User.dto";
import {CustomError} from "../../common/CustomError";
import {isLogin} from "../../middleware/auth.middleware";
import {ResetPwdDto} from "./dto/ResetPwd.dto";

const authController: Router = express.Router();

authController.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (error: any, user: any, info: { message: string } | undefined) => {
        if (error) {
            next(error);
        }

        if (info) {
            next(new CustomError(409, info.message));
        }

        if (user) {
            const jwtToken = await issueJwt(user.emailId, user.userName);
            const refreshToken = await issueRefreshToken(user.emailId);

            res.cookie('access_token', jwtToken)
                .cookie('refresh_token', refreshToken)
                .status(200)
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

authController.post('/reissue-token', isLogin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtToken = await reissueJwtToken(req.cookies.refresh_token);
        res.cookie('jwt_token', jwtToken)
            .send('success');
    } catch (error) {
        next(error);
    }
});

authController.post('/reset', isLogin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resetPwdDto = new ResetPwdDto()
            .setEmailId(req.body.emailId)
            .setPassword(req.body.password)
            .setNewPassword(req.body.newPassword);
        await resetPassword(resetPwdDto);

        res.status(200)
            .send('success');
    } catch (error) {
        next(error);
    }
});

export default authController;