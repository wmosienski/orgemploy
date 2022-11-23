import { ILoggerService, IUserService } from "@Services/interfaces";
import { DI_TYPES } from "DI_TYPES";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseController } from "./common/base.controller";
import 'reflect-metadata';
import { ValidateMiddleware } from "./middlewares/validation.middleware";
import { CatchError } from "./helpers/catch.error.decorator";
import { EmployeeInfoEditDTO } from "@DTO/user/employee/info/employee.info-edit.dto";
import { IEmployeeService } from "@Services/interfaces/employee.interface";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { HTTPCodes } from "./helpers/http-codes";

@CatchError(['constructor', 'bindRouters'])
@injectable()
export class EmployeeController extends BaseController {
    private readonly _employeeService: IEmployeeService;
    private readonly _userService: IUserService;

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.EmployeeService) employeeService: IEmployeeService,
        @inject(DI_TYPES.UserService) userService: IUserService,
    ) {
        super(loggerService);
        this._employeeService = employeeService;
        this._userService = userService;

        this.bindRouters([
            {
                path: '/edit-info',
                method: 'post',
                middlewares: [new AuthMiddleware(this._userService), new ValidateMiddleware(EmployeeInfoEditDTO, { skipMissingProperties: true })],
                func: this.editInfo,
            }
        ])
    }

    public async editInfo(req: Request<{}, {}, any>, res: Response): Promise<void> {
        const EmployeeInfoEditDTO: EmployeeInfoEditDTO = {
            ...req.body,
            userID: req.header('id'),
        }
        const result = await this._employeeService.editInfo(EmployeeInfoEditDTO);
        res.status(HTTPCodes.success.ok).send(result);
    }
}
