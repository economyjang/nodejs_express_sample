export class UserDto {
    private id?: string;
    private emailId!: string;
    private password!: string;
    private userName?: string;

    setId(id: string): UserDto {
        this.id = id;
        return this;
    }

    setEmailId(emailId: string): UserDto {
        this.emailId = emailId;
        return this;
    }

    setPassword(password: string): UserDto {
        this.password = password;
        return this;
    }

    setUserName(userName: string): UserDto {
        this.userName = userName;
        return this;
    }

    getId(): string | undefined {
        return this.id;
    }

    getEmailId(): string {
        return this.emailId;
    }

    getPassword(): string {
        return this.password;
    }

    getUserName(): string | undefined {
        return this.userName
    }
}