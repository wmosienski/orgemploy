import { ILoggerService, IUserService } from "@Services/interfaces";
import { DI_TYPES } from "DI_TYPES";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./common/base.controller";
import 'reflect-metadata';
import { ValidateMiddleware } from "./middlewares/validation.middleware";
import { UserRegisterDTO } from "@DTO/user/user-register.dto";
import { CatchError } from "./helpers/catch.error.decorator";
import { UserEditDTO } from "@DTO/user/user-edit.dto";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { HTTPCodes } from "./helpers/http-codes";
import { UserLoginDTO } from "@DTO/user/user-login.dto";

@CatchError(['constructor', 'bindRouters'])
@injectable()
export class UserController extends BaseController {
    private readonly _userService: IUserService;

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
            },
            {
                path: '/login',
                method: 'post',
                middlewares: [],
                func: this.login,
            },
            {
                path: '/edit',
                method: 'post',
                middlewares: [new AuthMiddleware(this._userService), new ValidateMiddleware(UserEditDTO)],
                func: this.edit,
            }
        ])
    }

    public async register(req: Request<{}, {}, any>, res: Response): Promise<void> {
        const userRegisterDTO: UserRegisterDTO = {
            ...req.body
        }
        const result = await this._userService.register(userRegisterDTO);
        res.status(HTTPCodes.success.created).send(result);
    }

    public async login(req: Request<{}, {}, any>, res: Response): Promise<void> {
        const userLoginDTO: UserLoginDTO = {
            ...req.body
        }
        const result = await this._userService.login(userLoginDTO);
        res.status(HTTPCodes.success.ok).send(result);
    }

    public async edit(req: Request<{}, {}, any>, res: Response): Promise<void> {
        const userEditDTO: UserEditDTO = {
            ...req.body,
        }
        const result = await this._userService.edit(userEditDTO);
        res.status(HTTPCodes.success.accepted).send(result);
    }
}
