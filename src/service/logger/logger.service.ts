import { Logger } from 'tslog';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILoggerService } from '../interfaces';

@injectable()
export class LoggerService implements ILoggerService {
    public logger: Logger;

    constructor() {

        this.logger = new Logger({

            displayInstanceName: false,

            displayLoggerName: false,

            displayFilePath: 'hidden',

            displayFunctionName: false,

        });

    }



    public log(...args: unknown[]): void {

        this.logger.info(...args);

    }

    public error(...args: unknown[]): void {
        this.logger.error(...args);
    }

    public warn(...args: unknown[]): void {
        this.logger.warn(...args);
    }
}