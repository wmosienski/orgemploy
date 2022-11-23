import { isHttpBadRequest } from "./isHttpBadRequest";
import { isHttpConflict } from "./isHttpConflict";
import { isHttpInternalServerError } from "./isHttpInternalServerError";
import { isHttpUnauthorized } from "./isHttpUnauthorized";

export const HTTPCodes = {

    informational_response: {
                     continue: 100,
    },

    success: {
                           ok: 200,
                      created: 201,
                     accepted: 202,
                   no_content: 204,
    },

    redirection: {
            moved_permanently: 301,
    },

    client_errors: {
                  bad_request: 400,
                 unauthorized: 401,
                    forbidden: 403,
                    not_found: 404,
                     conflict: 409,
    },
    server_errors: {
        internal_server_error: 500,
    }
}

export const getHttpCode = (error: Error): number => {
    return          (isHttpBadRequest(error) && HTTPCodes.client_errors.bad_request) 
        ||            (isHttpConflict(error) && HTTPCodes.client_errors.conflict)
        ||        (isHttpUnauthorized(error) && HTTPCodes.client_errors.unauthorized)
        || (isHttpInternalServerError(error) && HTTPCodes.server_errors.internal_server_error)
                                             || HTTPCodes.server_errors.internal_server_error;
}