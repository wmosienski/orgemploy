import { Unauthorized } from "@Errors/Unauthorized";

export const isHttpUnauthorized= (error: Error): boolean => {
    return (error instanceof Unauthorized);
}