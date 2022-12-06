import { Level, Log } from "@Log/log";
import { ILoggerOutput } from "@Log/logger.output.interface";
import LogsStorage from "@Providers/logs.storage";
import moment from "moment";

export class LoggerOutputFile implements ILoggerOutput {

    private readonly logsStorage: LogsStorage;
    private readonly minLevel: Level;

    constructor(path: string, minLevel: Level = Level.info) {
        this.minLevel = minLevel;
        this.logsStorage = new LogsStorage(path);
        this.logsStorage.start();

    }

    log(log: Log): void {
        if (log.level < this.minLevel) {
            return;
        }

        const time = moment().format('YYYY-MM-DD hh:mm:ss:SS');

        switch (log.level) {
            case Level.info:
                this.logsStorage.appendLine(`${time} INFO: ${log.toString()}`);
                break;
            case Level.warn:
                this.logsStorage.appendLine(`${time} WARN: ${log.toString()}`);
                break;
            case Level.error:
                this.logsStorage.appendLine(`${time} ERROR: ${log.toString()}`);
                break;
        }
    }
}