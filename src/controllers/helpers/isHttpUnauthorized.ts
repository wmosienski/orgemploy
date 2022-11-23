import { Unauthorized } from "errors/Unauthorized";

export const isHttpUnauthorized= (error: Error): boolean => {
    return (error instanceof Unauthorized);
}