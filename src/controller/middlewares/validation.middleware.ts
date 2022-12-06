import { IMiddleware } from "@Controller/interfaces/middleware.interface";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export class ValidateMiddleware implements IMiddleware {
    private readonly _classToValidate: ClassConstructor<object>;
    private readonly validateOptions: object;

    constructor(classToValidate: ClassConstructor<object>, validateOptions: object = {}) {
        this._classToValidate = classToValidate;
        this.validateOptions = validateOptions;
    }
    
    public execute(req: Request, res: Response, next: NextFunction) {
        const instanceOfClassToValidate = plainToClass(this._classToValidate, req.body);

        validate(instanceOfClassToValidate, this.validateOptions).then(validationErroInfo => {
            if (validationErroInfo.length) {
                res.status(400).send(JSON.stringify(validationErroInfo));
            } else {
                next();
            }
        });
    }
}
