import { UserRegisterDTO } from '@DTO/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { hash } from 'utils/crypt';
import { IUserService } from './interfaces';
import { ErrorInfo, ErrorType } from './utils/error-info';

@injectable()
export class UserService implements IUserService {

    constructor() {

    }

    public async register(userRegisterDTO: UserRegisterDTO): Promise<any[] | ErrorInfo> {
        if (await UserModel.findOne({email: userRegisterDTO.email})) {
            return new ErrorInfo('email already taken', ErrorType.CONFLICT);
        }
        userRegisterDTO.password = await hash(userRegisterDTO.password);
        return await UserModel.insertMany([userRegisterDTO]);
    }

}