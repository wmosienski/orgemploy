import { getHttpCode } from '@Controller/helpers/http-codes';
import { IErrorware } from '@Controller/interfaces/errorware.interface';
import { Request, Response, NextFunction } from 'express';

export class ResponseCodeMiddleware implements IErrorware {
    
    public execute(error: Error, req: Request, res: Response, next: NextFunction) {
        const _error = error as Error;
        const code = getHttpCode(_error)
        res.status(code).send(JSON.stringify(error));
        next();
    }
}