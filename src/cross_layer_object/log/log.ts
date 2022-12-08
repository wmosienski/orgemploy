export enum Level {
    info,
    warn,
    error
}

export class Log {

    private message: string;
    public level: Level;

    constructor(message: string, level: Level) {
        this.message = message;
        this.level = level;
    }

    toString(): string {
        return this.message;
    }
}

export const logInfo = (message: string) => new Log(message, Level.info);
export const logWarn = (message: string) => new Log(message, Level.warn);
export const logError = (message: string) => new Log(message, Level.error);