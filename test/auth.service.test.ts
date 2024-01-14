import {describe} from '@jest/globals';
import {signUp} from '../src/auth/auth.service';

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
});
