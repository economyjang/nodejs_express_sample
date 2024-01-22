export class CustomError extends Error {
    private readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'CustomError';
        this.status = status;
    }

    getMessage() {
        return this.message;
    }
    
    getStatus() {
        return this.status;
    }
}