import {describe} from '@jest/globals';
import {issueJwt, issueRefreshToken, signUp, validateUserPassword} from "../src/auth/auth.service";
import {AppDataSource} from "../src/data-source";
import {User} from "../src/auth/entity/User.entity";
import {UserDto} from "../src/auth/dto/User.dto";
import CryptoJs from "crypto-js";
import jwt from "jsonwebtoken";

const secretKey = 'nodejs-express-practice';

beforeAll(async () => {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.emailId = 'economyjang777@gmail.com';
    user.password = CryptoJs.AES.encrypt('12341234', secretKey).toString();
    user.userName = 'hello';
    await userRepository.save(user);
});

describe('회원가입 테스트', () => {
    test('사용자 이메일 아이디 형식 오류', async () => {
        const userDto = new UserDto()
            .setEmailId('economyjang777&gmail.com')
            .setPassword('12341234')
            .setUserName('helloworld');
        await expect(signUp(userDto)).rejects.toThrow('이메일 형식이 잘못되었습니다.');
    });

    test('사용자 패스워드 형식 오류', async () => {
        const userDto = new UserDto()
            .setEmailId('economyjang777@gmail.com')
            .setPassword('123')
            .setUserName('helloworld');
        await expect(signUp(userDto)).rejects.toThrow('비밀번호 형식이 잘못되었습니다.');
    });

    // 이메일 형식부터 검증
    test('사용자 이메일, 패스워드 형식 오류', async () => {
        const userDto = new UserDto()
            .setEmailId('economyjang777#gmail.com')
            .setPassword('123')
            .setUserName('helloworld');
        await expect(signUp(userDto)).rejects.toThrow('이메일 형식이 잘못되었습니다.');
    });

    test('이미 존재하는 사용자인지 검증', async () => {
        const userDto = new UserDto()
            .setEmailId('economyjang777@gmail.com')
            .setPassword('12341234')
            .setUserName('helloworld');
        await expect(signUp(userDto)).rejects.toThrow('이미 존재하는 사용자 입니다.');
    });
});

describe('로그인 테스트', () => {
    const mockCallback = jest.fn();

    test('존재하지 않은 사용자 일 때', async () => {
        const emailId = 'economyjang123@gmail.com';
        const password = '11111122222';

        await validateUserPassword(emailId, password, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, false, { message : '존재하지 않는 사용자 입니다.'})
    });

    test('패스워드가 일치하지 않을 때', async () => {
        const emailId = 'economyjang777@gmail.com';
        const password = '11111122222';

        await validateUserPassword(emailId, password, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(null, false, { message : '패스워드가 일치하지 않습니다.'});
    });

    test('JWT 토근 발행', async () => {
        const emailId = 'economyjang777@gmail.com';
        const userName = 'jang';

        const jwtToken = jwt.sign({emailId, userName}, secretKey, {expiresIn: '1d'});
        await expect(issueJwt(emailId, userName)).resolves.toEqual(jwtToken);
    });

    test('Refresh 토큰 발행 및 DB 저장', async () => {
        const emailId = 'economyjang777@gmail.com';

        const refreshToken = jwt.sign({emailId}, secretKey, {expiresIn: '1m'});
        await expect(issueRefreshToken(emailId)).resolves.toEqual(refreshToken);
    });
});
