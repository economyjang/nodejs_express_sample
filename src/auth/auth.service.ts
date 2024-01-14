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

    // 사용자가 입력한 데이터 형식 검증
    const formValidation = await validate(user);
    if (formValidation.length > 0) {
        const emailIdValidation = formValidation.filter((value) => value.property === 'emailId');
        if(emailIdValidation.length > 0) {
            throw new Error('이메일 형식이 잘못되었습니다.');
        }

        const passwordValidation = formValidation.filter((value) => value.property === 'password');
        if(passwordValidation.length > 0) {
            throw new Error('비밀번호 형식이 잘못되었습니다.');
        }
    }

    // 이미 존재하는 Email Id 인지 검증
    const existUserValidation = await userRepository.exists({where: {emailId: user.emailId}});
    if (existUserValidation) {
        throw new Error('이미 존재하는 사용자 입니다.');
    }

    await userRepository.save(user);
}