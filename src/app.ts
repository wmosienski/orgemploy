import { UserController } from '@Controller/user.controller';
import { ILoggerService } from '@Service/interfaces';
import { DI_TYPES } from 'DI_TYPES';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from "inversify";
import * as bodyParser from 'body-parser';
import 'dotenv';
import { ResponseCodeMiddleware } from '@Controller/middlewares/response.code.errorware';
import { EmployeeService } from '@Service/employee.service';
import { EmployeeController } from '@Controller/employee.controller';

const DEFAULT_PORT = 5000;

@injectable()
export class App {
    private readonly _app: Express;
    private _server: Server | undefined;
    private readonly _loggerService: ILoggerService;
    private readonly _port: number;
    private readonly _userController: UserController;
    private readonly _employeeController: EmployeeController;

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.UserController) userController: UserController,
        @inject(DI_TYPES.EmployeeController) employeeController: EmployeeController,
    ) {
        this._loggerService = loggerService;
        this._app = express();
        this._port = Number(process.env.PORT) || DEFAULT_PORT;
        this._userController = userController;
        this._employeeController = employeeController;
    }

    public useMiddleware(): void {
        this._app.use(bodyParser.urlencoded({ extended: false }))
        this._app.use(bodyParser.json());
    }

    public useRoutes(): void {
        this._app.use('/users', this._userController.router)
        this._app.use('/employees', this._employeeController.router)
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this._app.use(new ResponseCodeMiddleware().execute)
        this._server = this._app.listen(this._port);
        this._loggerService.info('Server is running');
        this._loggerService.error('test - not an actual error');
    }
}
