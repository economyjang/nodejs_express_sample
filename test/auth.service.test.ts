import {describe} from '@jest/globals';
import {signUp} from "../src/auth/auth.service";
import {AppDataSource} from "../src/data-source";
import {User} from "../src/auth/entity/User.entity";

beforeAll(async () => {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.emailId = 'economyjang777@gmail.com';
    user.password = '12341234';
    user.userName = 'hello';
    await userRepository.save(user);
});

describe('회원가입 테스트', () => {
    test('사용자 이메일 아이디 형식 오류', async () => {
        const body = {
            emailId: 'economyjang777&google.com',
            password: '12341234',
            userName: 'helloworld'
        }
        await expect(signUp(body)).rejects.toThrow('이메일 형식이 잘못되었습니다.');
    });

    test('사용자 패스워드 형식 오류', async () => {
        const body = {
            emailId: 'economyjang777@google.com',
            password: '123',
            userName: 'helloworld'
        }
        await expect(signUp(body)).rejects.toThrow('비밀번호 형식이 잘못되었습니다.');
    });

    // 이메일 형식부터 검증
    test('사용자 이메일, 패스워드 형식 오류', async () => {
        const body = {
            emailId: 'economyjang777#google.com',
            password: '123',
            userName: 'helloworld'
        }
        await expect(signUp(body)).rejects.toThrow('이메일 형식이 잘못되었습니다.');
    });

    test('이미 존재하는 사용자인지 검증', async () => {
        const body = {
            emailId: 'economyjang777@gmail.com',
            password: '12341234',
            userName: 'hello'
        };

        await expect(signUp(body)).rejects.toThrow('이미 존재하는 사용자 입니다.');
    });
})
