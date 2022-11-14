import { IMiddleware } from "@Controllers/interfaces/middleware.interface";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import e, { NextFunction, Request, Response } from "express";

export class ValidateMiddleware implements IMiddleware {
    private readonly _classToValidate: ClassConstructor<object>;

    constructor(classToValidate: ClassConstructor<object>) {
        this._classToValidate = classToValidate;
    }
    
    public execute(req: Request, res: Response, next: NextFunction) {
        const instanceOfClassToValidate = plainToClass(this._classToValidate, req.body);

        validate(instanceOfClassToValidate).then(validationErroInfo => {
            if (validationErroInfo) {
                res.status(400).send();
            } else {
                next();
            }
        });
    }
}
