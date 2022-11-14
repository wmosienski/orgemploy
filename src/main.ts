import { UserController } from "@Controllers/user.controller";
import { LoggerService } from "@Services";
import { ILoggerService } from "@Services/interfaces";
import { App } from "app";
import { DI_TYPES } from "DI_TYPES";
import { Container, ContainerModule, interfaces } from "inversify";

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILoggerService>(DI_TYPES.LoggerService).to(LoggerService).inSingletonScope();
    bind<UserController>(DI_TYPES.UserController).to(UserController).inSingletonScope();
    bind<App>(DI_TYPES.App).to(App);
});

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();

    appContainer.load(appBindings);

    const app = appContainer.get<App>(DI_TYPES.App);

    app.init();

    return {appContainer, app};
}

export const {app, appContainer} = bootstrap();

