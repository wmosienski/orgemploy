import { SomethingWentWrong } from "@Errors/SomethingWentWrong";

export const isHttpInternalServerError = (error: Error): boolean => {
    return (error instanceof SomethingWentWrong);
}