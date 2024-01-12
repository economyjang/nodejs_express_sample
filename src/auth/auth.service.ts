import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import {validate} from "class-validator";
import {AppDataSource} from "../data-source";
import {User} from "./entity/User.entity";

passport.use(new LocalStrategy(async (username, password, done) => {
    // 여기에 사용자 검증 로직 작성
    // 예: const user = await User.findOne({ username });
    // 성공시 JWT 생성 및 반환
    // 예: done(null, user);
}));

// Passport-jwt 설정
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'NodejsExpressSample'
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // JWT 페이로드를 기반으로 사용자 검증
    // 예: User.findById(jwt_payload.id)
}));

export const signUp = async (body: any) => {
    // 사용자 아이디, 패스워드, 사용자 이름
    const user = new User();
    user.emailId = body.emailId;
    user.password = body.password;
    user.userName = body.userName;

    const userRepository = AppDataSource.getRepository(User);

    const validateResult = await validate(user);
    if(validateResult.length > 0) {
        console.log("Validation failed: ", validateResult);
    } else {
        await userRepository.save(user);
    }
}