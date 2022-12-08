import path from "path";

export const config = {
    tokenExpireTime: 999999,
    newTokenAfter: 777777,
    fileLogBatchSizeDefault: 10,
    logFilePath: path.join(process.cwd(), 'logs/logs.log'),
    logFileErrorsPath: path.join(process.cwd(), 'logs/logs_errors.log')
}