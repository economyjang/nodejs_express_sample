import {IsNotEmpty, Length} from "class-validator";

export class ResetPwdDto {
    private emailId!: string;
    private password!: string;

    @Length(5, 20)
    private newPassword!: string;

    setEmailId(emailId: string) {
        this.emailId = emailId;
        return this;
    }

    setPassword(password: string) {
        this.password = password;
        return this;
    }

    setNewPassword(newPassword: string) {
        this.newPassword = newPassword;
        return this;
    }

    getEmailId() {
        return this.emailId;
    }

    getPassword() {
        return this.password;
    }

    getNewPassword() {
        return this.newPassword;
    }
}