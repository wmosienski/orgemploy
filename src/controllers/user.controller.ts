import { ILoggerService, IUserService } from "@Services/interfaces";
import { DI_TYPES } from "DI_TYPES";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./common/base.controller";
import 'reflect-metadata';
import { ValidateMiddleware } from "./middlewares/validation.middleware";
import { UserRegisterDTO } from "@DTO/user-register.dto";
import { HttpCodes } from "./utils/http-codes";
import { ErrorInfo, ErrorType } from "@Services/utils/error-info";

@injectable()
export class UserController extends BaseController {
    private readonly _userService: IUserService

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.UserService) userService: IUserService,
    ) {
        super(loggerService);
        this._userService = userService;

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
        const userRegisterDTO: UserRegisterDTO = {
            ...req.body
        }
        const result = await this._userService.register(userRegisterDTO);
        if (result instanceof ErrorInfo) {
            res.status(HttpCodes[ErrorType[result.type]]).send(result.message);
            return;
        }
        res.status(200).send(result);
    }
}
