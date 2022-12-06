import { Request, Response, NextFunction } from 'express';

export const CatchError = (excluded: string[]) => <T>(target: new (...params: any[]) => T) => {
    for (const propertyName of Reflect.ownKeys(target.prototype).filter(key => excluded.indexOf(key as string) === -1)) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target.prototype, propertyName);
        const isMethod = descriptor?.value instanceof Function;
        if (!isMethod) {
            continue;
        }

        const originalMethod = descriptor.value;
        descriptor.value = async function (
            this: any, req: Request, res: Response, next: NextFunction
        ) {
            try {
                return await originalMethod.apply(this, [req, res, next]);
            } catch (err) {
                return next(err);
            }
        };
        Object.defineProperty(target.prototype, propertyName as string, descriptor);
    }
}

