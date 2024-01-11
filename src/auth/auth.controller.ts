import express, {NextFunction, Request, Response, Router} from "express";

const authController: Router = express.Router();

// TODO 로그인
authController.post('/login', (req: Request, res: Response, next: NextFunction) => {
});

// TODO 로그아웃
authController.post('/logout', (req: Request, res: Response, next: NextFunction) => {
});

// TODO 회원가입
authController.post('/signup', (req: Request, res: Response, next: NextFunction) => {

});

// TODO JWT 토큰 재발급
authController.post('/refresh-token', (req: Request, res: Response, next: NextFunction) => {
});

// TODO 비밀번호 재설정
authController.post('/reset', (req: Request, res: Response, next: NextFunction) => {
});

export default authController;