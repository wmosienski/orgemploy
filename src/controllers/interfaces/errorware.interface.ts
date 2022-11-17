import { NextFunction, Request, Response } from 'express';

export interface IErrorware {
    execute: (error: Error, req: Request, res: Response, next: NextFunction) => void;
}


