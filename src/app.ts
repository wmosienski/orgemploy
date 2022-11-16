import { UserController } from '@Controllers/user.controller';
import { ILoggerService } from '@Services/interfaces';
import { DI_TYPES } from 'DI_TYPES';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from "inversify";
import * as bodyParser from 'body-parser';
import 'dotenv';

const DEFAULT_PORT = 5000;

@injectable()
export class App {
    private readonly _app: Express;
    private _server: Server | undefined;
    private readonly _loggerService: ILoggerService;
    private readonly _port: number;
    private readonly _userController: UserController;

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.UserController) userController: UserController,
    ) {
        this._loggerService = loggerService;
        this._app = express();
        this._port = Number(process.env.PORT) || DEFAULT_PORT;
        this._userController = userController;
    }

    public useMiddleware(): void {
        this._app.use(bodyParser.urlencoded({ extended: false }))
        this._app.use(bodyParser.json());
    }

    public useRoutes(): void {
        this._app.use('/users', this._userController.router)
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this._server = this._app.listen(this._port);
        this._loggerService.log('Server is running');
    }
}
