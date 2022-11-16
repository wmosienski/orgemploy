import { ErrorType } from "@Services/utils/error-info";

export const HttpCodes = {
    [ErrorType[ErrorType.CONFLICT]]: 409,
}