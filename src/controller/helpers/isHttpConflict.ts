import { ValueAlreadyInUse } from "@Errors/ValueAlreadyInUse";

export const isHttpConflict = (error: Error): boolean => {
    return (error instanceof ValueAlreadyInUse);
}