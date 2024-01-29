import jwt from 'jsonwebtoken';
import {validate} from "class-validator";
import {AppDataSource} from "../../data-source";
import {User} from "./entity/User.entity";
import CryptoJS from 'crypto-js';
import {UserDto} from "./dto/User.dto";
import {CustomError} from "../../common/CustomError";
import {ResetPwdDto} from "./dto/ResetPwd.dto";
import {LoginHistory} from "./entity/LoginHistory.entity";

const secretKey = 'nodejs-express-practice';

export const validateUserPassword = async (emailId: string, password: string, done: Function) => {
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({where: {emailId: emailId}});
        if (!user) {
            return done(null, false, {message: '존재하지 않는 사용자 입니다.'});
        }

        if (CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8) !== password) {
            return done(null, false, {message: '패스워드가 일치하지 않습니다.'});
        }

        return done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
}

export const validateJwtToken = async (jwtToken: string) => {
    return jwt.verify(jwtToken, secretKey);
}

export const issueJwt = async (emailId: string, userName: string) => {
    return jwt.sign({emailId, userName}, secretKey, {expiresIn: '1d'});
};

export const issueRefreshToken = async (emailId: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: {emailId},
        relations: {
            loginHistory: true,
        }
    });

    if (user) {
        const refreshToken = jwt.sign({emailId}, secretKey, {expiresIn: '30d'});

        const loginHistoryRepository = AppDataSource.getRepository(LoginHistory);
        const loginHistory = new LoginHistory();
        loginHistory.refreshToken = refreshToken;
        await loginHistoryRepository.save(loginHistory);

        user.loginHistory = [loginHistory];
        await userRepository.save(user);

        return refreshToken;
    }
}

export const reissueJwtToken = async (refreshToken: string) => {
    try {
        // refreshToken 검증
        const jwtPayload = jwt.verify(refreshToken, secretKey) as { emailId: string, iat: number, exp: number };

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {emailId: jwtPayload.emailId}});

        const loginHistoryRepository = AppDataSource.getRepository(LoginHistory);
        const loginHistory = await loginHistoryRepository.findOne({where: {refreshToken}});

        if (user && loginHistory) {
            return await issueJwt(user.emailId, user.userName);
        } else {
            // refreshToken 검증
            throw new Error('No Exist RefreshToken');
        }
    } catch (error) {
        console.log(error);
        throw new CustomError(400, '다시 로그인 필요');
    }
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
            throw new CustomError(409, '이메일 형식이 잘못되었습니다.');

        }
        const passwordValidation = formValidation.filter((value) => value.property === 'password');
        if (passwordValidation.length > 0) {
            throw new CustomError(409, '비밀번호 형식이 잘못되었습니다.');
        }
    }

    // 이미 존재하는 Email Id 인지 검증
    const existUserValidation = await userRepository.exists({where: {emailId: user.emailId}});
    if (existUserValidation) {
        throw new CustomError(409, '이미 존재하는 사용자 입니다.');
    }

    // 비밀번호 암호화
    user.password = CryptoJS.AES.encrypt(userDto.getPassword(), secretKey).toString();

    await userRepository.save(user);
}

export const resetPassword = async (resetPasswordDto: ResetPwdDto) => {
    // 사용자가 입력한 데이터 형식 검증
    const formValidation = await validate(resetPasswordDto);
    if (formValidation.length > 0) {
        const passwordValidation = formValidation.find((value) => value.property === 'newPassword');
        if (passwordValidation && passwordValidation.constraints) {
            if ('isLength' in passwordValidation.constraints) {
                throw new CustomError(409, '신규 비밀번호 길이는 5 ~ 20자 입니다.');
            }
        }
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({where: {emailId: resetPasswordDto.getEmailId()}});

    if (!user) throw new CustomError(401, '존재하지 않는 사용자 입니다.');
    if (CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8) !== resetPasswordDto.getPassword()) {
        throw new CustomError(401, '패스워드가 일치하지 않습니다.');
    }

    user.password = resetPasswordDto.getNewPassword();
    await userRepository.save(user);
}

export const logout = async () => {

}