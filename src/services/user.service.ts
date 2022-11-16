import { UserRegisterDTO } from '@DTO/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { hash } from 'utils/crypt';
import { IUserService } from './interfaces';

@injectable()
export class UserService implements IUserService {

    constructor() {

    }

    public async register(userRegisterDTO: UserRegisterDTO): Promise<any[] | void | string> {
        if (await UserModel.findOne({email: userRegisterDTO.email})) {
            return 'email already taken';
        }
        userRegisterDTO.password = await hash(userRegisterDTO.password);
        return await UserModel.insertMany([userRegisterDTO]);
    }

}