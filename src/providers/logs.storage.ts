import fs, { WriteStream } from 'fs';
import { config } from '@Utils/config';

const lineSeparator = '\n';
const defaultBatchSize = config.fileLogBatchSizeDefault;

export default class LogsStorage {

    private readonly streamOptions: object;
    private readonly batchSize: number;
    private fileStream: WriteStream | undefined;
    private batchCounter: number = 0;
    private path: string;

    constructor(path: string, streamOptions: object = {flags:'a'}, batchSize: number = defaultBatchSize) {
        this.path = path;
        this.streamOptions = streamOptions;
    }

    createIfNotExist(path: string) {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '');
        }
    }

    start() {
        this.createIfNotExist(this.path);
        this.fileStream = fs.createWriteStream(this.path, this.streamOptions);
    }

    getCharLength() {
        return fs.readFileSync(this.path)?.length;
    }

    end() {
        this.fileStream?.end();
    }

    restart(path: string) {
        this.end();
        this.path = path;
        this.start();
    }

    clearFile() {
        fs.writeFileSync(this.path, '');
    }

    appendLine(value: string): any {
        if (this.batchCounter >= this.batchSize) {
            this.batchCounter = 0;
            this.end();
            this.start();
        }
        this.batchCounter++;
        return this.fileStream?.write(value + lineSeparator);
    }
}