import { ILoggerService } from "@Services/interfaces";
import { DI_TYPES } from "DI_TYPES";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./common/base.controller";
import 'reflect-metadata';
import { ValidateMiddleware } from "./middlewares/validation.middleware";
import { UserRegisterDTO } from "@DTO";

@injectable()
export class UserController extends BaseController {
    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
    ) {
        super(loggerService);

        this.bindRouters([
            {
                path: '/register',
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDTO)],
                func: this.register,
            }
        ])
    }

    public async register(req: Request<{}, {}, any>, res: Response): Promise<void> {
        console.log('register');
    }
}
