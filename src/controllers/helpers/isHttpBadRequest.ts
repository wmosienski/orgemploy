import { WrongData } from "errors/WrongData"

export const isHttpBadRequest = (error: Error): boolean => {
    return (error instanceof WrongData);
}