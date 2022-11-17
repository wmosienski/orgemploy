import { AuthMiddleware } from "@Controllers/middlewares/auth.middleware";
import { UserController } from "@Controllers/user.controller";
import initializeMongo from "@Database/mongo/mongo";
import { LoggerService, UserService } from "@Services";
import { ILoggerService, IUserService } from "@Services/interfaces";
import { App } from "app";
import { DI_TYPES } from "DI_TYPES";
import { Container, ContainerModule, interfaces } from "inversify";

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILoggerService>(DI_TYPES.LoggerService).to(LoggerService).inSingletonScope();
    bind<IUserService>(DI_TYPES.UserService).to(UserService).inSingletonScope();
    bind<UserController>(DI_TYPES.UserController).to(UserController).inSingletonScope();
    bind<App>(DI_TYPES.App).to(App);
});

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();

    appContainer.load(appBindings);

    initializeMongo();

    const app = appContainer.get<App>(DI_TYPES.App);

    app.init();

    return {appContainer, app};
}

export const {app, appContainer} = bootstrap();

