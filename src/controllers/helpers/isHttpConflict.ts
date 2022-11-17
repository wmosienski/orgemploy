import { ValueAlreadyInUse } from "errors/ValueAlreadyInUse";

export const isHttpConflict = (error: Error): boolean => {
    return (error instanceof ValueAlreadyInUse);
}