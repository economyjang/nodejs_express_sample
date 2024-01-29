import {afterEach, describe} from '@jest/globals';
import {
    issueJwt,
    issueRefreshToken,
    reissueJwtToken,
    resetPassword,
    signUp,
    validateUserPassword
} from "../../src/module/auth/auth.service";
import {AppDataSource} from "../../src/data-source";
import {User} from "../../src/module/auth/entity/User.entity";
import {UserDto} from "../../src/module/auth/dto/User.dto";
import CryptoJs from "crypto-js";
import jwt from "jsonwebtoken";
import {ResetPwdDto} from "../../src/module/auth/dto/ResetPwd.dto";
import {LoginHistory} from "../../src/module/auth/entity/LoginHistory.entity";

const secretKey = 'nodejs-express-practice';

beforeAll(async () => {
    await AppDataSource.initialize();

    const loginHistoryRepository = AppDataSource.getRepository(LoginHistory);
    const loginHistory = new LoginHistory();
    loginHistory.refreshToken = jwt.sign({emailId: 'economyjang777@gmail.com'}, secretKey, {expiresIn: '1m'});
    await loginHistoryRepository.save(loginHistory);

    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.emailId = 'economyjang777@gmail.com';
    user.password = CryptoJs.AES.encrypt('12341234', secretKey).toString();
    user.userName = 'hello';
    user.loginHistory = [loginHistory];
    await userRepository.save(user);
});

afterAll(async () => {
    await AppDataSource.dropDatabase();
})

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

    describe('아이디 패스워드 인증 테스트', () => {
        test('정상 로그인', async () => {
            const emailId = 'economyjang777@gmail.com';
            const password = '12341234'

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({where: {emailId}});
            await validateUserPassword(emailId, password, mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(null, user);
        });

        test('존재하지 않은 사용자 일 때', async () => {
            const emailId = 'economyjang123@gmail.com';
            const password = '11111122222';

            await validateUserPassword(emailId, password, mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(null, false, {message: '존재하지 않는 사용자 입니다.'})
        });

        test('패스워드가 일치하지 않을 때', async () => {
            const emailId = 'economyjang777@gmail.com';
            const password = '11111122222';

            await validateUserPassword(emailId, password, mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(null, false, {message: '패스워드가 일치하지 않습니다.'});
        });
    })

    describe('JWT 토큰 정상 테스트', () => {
        test('JWT 토근 발행 - 정상 프로세스', async () => {
            const emailId = 'economyjang777@gmail.com';
            const userName = 'jang';

            await expect(issueJwt(emailId, userName)).resolves.not.toBeUndefined()
        });

        test('JWT 토근 재발행 - 정상 프로세스', async () => {
            const emailId = 'economyjang777@gmail.com';
            const userName = 'hello';

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({relations: {loginHistory: true}, where: {emailId}});
            await expect(reissueJwtToken(user!.loginHistory[0].refreshToken)).resolves.not.toBeUndefined()
        });

        test('Refresh 토큰 발행 및 DB 저장', async () => {
            const emailId = 'economyjang777@gmail.com';

            await expect(issueRefreshToken(emailId)).resolves.not.toBeUndefined()
        });

        test('JWT 토근 재발행 - RefreshToken Secret Key 가 불일치 할 때', async () => {
            const emailId = 'economyjang777@gmail.com';

            const refreshToken = jwt.sign({emailId}, 'secretKey', {expiresIn: '30d'});
            await expect(reissueJwtToken(refreshToken)).rejects.toThrow('다시 로그인 필요')
        });

        // test('JWT 토근 재발행 - RefreshToken 이 존재하지 않을 때', async () => {
        //     const emailId = 'economyjang777@gmail.com';
        //
        //     const loginHistoryRepository = AppDataSource.getRepository(LoginHistory);
        //     const loginHistory = await loginHistoryRepository.find({relations: {user: true}});
        //     await loginHistoryRepository.softDelete({id: loginHistory[0].id});
        //
        //     console.log(loginHistory);
        //
        //     const refreshToken = jwt.sign({emailId}, secretKey, {expiresIn: '30d'});
        //     await expect(reissueJwtToken(refreshToken)).rejects.toThrow('다시 로그인 필요')
        // });
    });
});

describe('패스워드 변경 테스트', () => {
    describe('신규 비밀번호 형식 테스트', () => {
        const resetPwdDto = new ResetPwdDto()
            .setEmailId('kyungjaejang777@gmail.com')
            .setPassword('12341234')

        test('신규 비밀번호 형식이 잘못되었을 때 - 공백일 때', async () => {
            await expect(resetPassword(resetPwdDto)).rejects.toThrow('신규 비밀번호 길이는 5 ~ 20자 입니다.');
        });

        test('신규 비밀번호 형식이 잘못되었을 때 - 길이가 짧을 때(5, 20)', async () => {
            resetPwdDto.setNewPassword('12');

            await expect(resetPassword(resetPwdDto)).rejects.toThrow('신규 비밀번호 길이는 5 ~ 20자 입니다.');
        });

        test('신규 비밀번호 형식이 잘못되었을 때 - 길이가 길 때(5, 20)', async () => {
            resetPwdDto.setNewPassword('12341234123412341234123412341234');

            await expect(resetPassword(resetPwdDto)).rejects.toThrow('신규 비밀번호 길이는 5 ~ 20자 입니다.');
        });
    });
});
