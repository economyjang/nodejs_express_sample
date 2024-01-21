import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import {validate} from "class-validator";
import {AppDataSource} from "../data-source";
import {User} from "./entity/User.entity";
import CryptoJS from 'crypto-js';
import {UserDto} from "./dto/User.dto";

const secretKey = 'nodejs-express-practice';

export const validateUserPassword = async (emailId: string, password: string, done: Function) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({where: {emailId: emailId}});
        if (!user) {
            return done(null, false, { message : '존재하지 않는 사용자 입니다.'});
        }

        if(CryptoJS.AES.decrypt(user.password, secretKey).toString() !== password){
            return done(null, false, { message : '패스워드가 일치하지 않습니다.'});
        }

        return done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
}

// Passport-jwt 설정
// const opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: secretKey
// };
//
// passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
//     // JWT 페이로드를 기반으로 사용자 검증
//     // 예: User.findById(jwt_payload.id)
// }));

export const login = async () => {
    passport.authenticate('local', (error: any, user: any, info: any) => {
        if(error) {
            throw error;
        }

        console.log(user);
        console.log(info);
    });
}


export const signUp = async (userDto: UserDto) => {
    // 사용자 아이디, 패스워드, 사용자 이름
    const user = new User();
    user.emailId = userDto.getEmailId();
    user.password = userDto.getPassword();
    user.userName = userDto.getUserName()!;

    const userRepository = AppDataSource.getRepository(User);

    // 사용자가 입력한 데이터 형식 검증
    const formValidation = await validate(user);
    if (formValidation.length > 0) {
        const emailIdValidation = formValidation.filter((value) => value.property === 'emailId');
        if (emailIdValidation.length > 0) {
            throw new Error('이메일 형식이 잘못되었습니다.');

        }
        const passwordValidation = formValidation.filter((value) => value.property === 'password');
        if (passwordValidation.length > 0) {
            throw new Error('비밀번호 형식이 잘못되었습니다.');
        }
    }

    // 이미 존재하는 Email Id 인지 검증
    const existUserValidation = await userRepository.exists({where: {emailId: user.emailId}});
    if (existUserValidation) {
        throw new Error('이미 존재하는 사용자 입니다.');
    }

    // 비밀번호 암호화
    user.password = CryptoJS.AES.encrypt(userDto.getPassword(), secretKey).toString();

    await userRepository.save(user);
}