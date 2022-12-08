import { Level, Log } from "@Log/log";
import { ILoggerOutput } from "@Log/logger.output.interface";
import { Logger } from 'tslog';

export class LoggerOutputConsole implements ILoggerOutput {

    private readonly logger: Logger;

    constructor() {

        this.logger = new Logger({

            displayInstanceName: false,

            displayLoggerName: false,

            displayFilePath: 'hidden',

            displayFunctionName: false,

        });

    }

    log(log: Log): void {
        switch (log.level) {
            case Level.info:
                this.logger.info(log.toString());
                break;
            case Level.warn:
                this.logger.warn(log.toString());
                break;
            case Level.error:
                this.logger.error(log.toString());
                break;
        }
    }
}