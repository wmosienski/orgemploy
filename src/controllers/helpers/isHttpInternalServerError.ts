import { SomethingWentWrong } from "errors/SomethingWentWrong";

export const isHttpInternalServerError = (error: Error): boolean => {
    return (error instanceof SomethingWentWrong);
}