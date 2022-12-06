import { injectable } from 'inversify';
import 'reflect-metadata';
import { ILoggerService } from '../interfaces';
import { ILoggerOutput } from '@Log/logger.output.interface';
import { LoggerOutputConsole } from '@Log/logger.output.console';
import { LoggerOutputFile } from '@Log/logger.output.file';
import { config } from '@Utils/config';
import { Level, logError, logInfo, logWarn } from '@Log/log';

@injectable()
export class LoggerService implements ILoggerService {

    private readonly outputs: ILoggerOutput[] = [
        new LoggerOutputConsole(),
        new LoggerOutputFile(config.logFilePath),
        new LoggerOutputFile(config.logFileErrorsPath, Level.error),
    ]

    public info(message: string): void {
        this.outputs.forEach(output => output.log(logInfo(message)));
    }

    public warn(message: string): void {
        this.outputs.forEach(output => output.log(logWarn(message)));
    }

    public error(message: string): void {
        this.outputs.forEach(output => output.log(logError(message)));
    }
}