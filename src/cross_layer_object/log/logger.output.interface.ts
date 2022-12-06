import { Log } from "./log";

export interface ILoggerOutput {

    log: (log: Log) => void;

}
