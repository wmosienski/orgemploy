import { IMiddleware } from "@Controller/interfaces/middleware.interface";
import { IUserService } from "@Service/interfaces";
import { Unauthorized } from "@Errors/Unauthorized";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware implements IMiddleware {
    private readonly _userService: IUserService

    constructor(userService: IUserService) {
        this._userService = userService;
    }

    public async execute(req: Request, res: Response, next: NextFunction) {
        if (!req.header('userID') || !req.header('token')) {
            next(new Unauthorized('no header id or token provided'));
        } else {
            const userID = req.header('userID') || '';
            const token = req.header('token') || '';
            try {
                await this._userService.verifyToken(userID, token);
            } catch (err) {
                next(err);
            }
            next();
        }
    }
}
