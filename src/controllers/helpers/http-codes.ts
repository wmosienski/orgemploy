import { isHttpBadRequest } from "./isHttpBadRequest";
import { isHttpConflict } from "./isHttpConflict";
import { isHttpUnauthorized } from "./isHttpUnauthorized";

export const getHttpCode = (error: Error): number => {
    return (isHttpBadRequest(error) && 400) 
        || (isHttpConflict  (error) && 409)
        || (isHttpUnauthorized  (error) && 401)
        || 500;
}