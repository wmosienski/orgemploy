import { WrongData } from "@Errors/WrongData"

export const isHttpBadRequest = (error: Error): boolean => {
    return (error instanceof WrongData);
}