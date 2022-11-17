import { isHttpBadRequest } from "./isHttpBadRequest";
import { isHttpConflict } from "./isHttpConflict";

export const getHttpCode = (error: Error): number => {
    return (isHttpBadRequest(error) && 400) 
        || (isHttpConflict  (error) && 409)
        || 500;
}