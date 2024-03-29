import {NextFunction, Request, RequestHandler, Response} from "express";
import {validateJwtToken} from "../module/auth/auth.service";

// TODO 매번 DB 에 조회를 해야 할까?
export const isLogin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await validateJwtToken(req.cookies.jwt_token);
        next();
    } catch (error) {
        res.status(403).send('로그인 필요');
    }
}
