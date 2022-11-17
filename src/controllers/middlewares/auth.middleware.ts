import { IMiddleware } from "@Controllers/interfaces/middleware.interface";
import { IUserService } from "@Services/interfaces";
import { Unauthorized } from "errors/Unauthorized";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware implements IMiddleware {
    private readonly _userService: IUserService

    constructor(userService: IUserService) {
        this._userService = userService;
    }

    public async execute(req: Request, res: Response, next: NextFunction) {
        if (!req.header('id') || !req.header('token')) {
            next(new Unauthorized('no header id or token provided'));
        } else {
            const id = req.header('id') || '';
            const token = req.header('token') || '';
            try {
                await this._userService.verifyAndRestartToken(id, token);
            } catch (err) {
                next(err);
            }
            next();
        }
    }
}
