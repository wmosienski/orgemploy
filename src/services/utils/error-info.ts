export class ErrorInfo {
    public message: string
    public type: ErrorType

    constructor(message: string, type: ErrorType) {
        this.message = message;
        this.type = type;
    }
}

export enum ErrorType {
    CONFLICT
}