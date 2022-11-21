import { UserRegisterDTO } from '@DTO/user/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { compare, generateToken, hash, verifyToken } from 'utils/crypt';
import { IUserService } from './interfaces';
import { ValueAlreadyInUse } from 'errors/ValueAlreadyInUse';
import { UserEditDTO } from '@DTO/user/user-edit.dto';
import { UserLoginResponseDTO } from '@DTO/user/user-login-response.dto';
import { config } from 'utils/config';
import { Unauthorized } from 'errors/Unauthorized';
import { UserLoginDTO } from '@DTO/user/user-login.dto';

@injectable()
export class UserService implements IUserService {

    public async register(userRegisterDTO: UserRegisterDTO): Promise<any[]> {
        if (await UserModel.findOne({email: userRegisterDTO.email})) {
            throw new ValueAlreadyInUse('email already taken');
        }
        userRegisterDTO.password = await hash(userRegisterDTO.password);
        return await UserModel.insertMany([userRegisterDTO]);
    }

    public async login(userLoginDTO: UserLoginDTO): Promise<UserLoginResponseDTO> {
        const user = await UserModel.findOne({email: userLoginDTO.email});

        if (!user?._id) {
            throw new Unauthorized('wrong email or password');
        }

        if (!await compare(userLoginDTO.password, user?.password || '')) {
            throw new Unauthorized('wrong email or password');
        }

        const token = await generateToken(user?._id, Date.now() / 1000 + config.exp)
        const userLoginResponseDTO: UserLoginResponseDTO =  {
            _id: user?._id,
            token
        }

        await UserModel.updateOne(
            {email: user.email},
            {token}
        );

        return userLoginResponseDTO;
    }

    public async edit(userEditDTO: UserEditDTO): Promise<void> {
        const anyUser = await UserModel.findOne({email: userEditDTO.newEmail})
        if (anyUser?.email) {
            throw new ValueAlreadyInUse('new email is already taken');
        }

        const user = await UserModel.findOne({email: userEditDTO.email})
        if (!user?.email) {
            throw new Unauthorized('user with the email does not exist');
        }

        userEditDTO.newPassword = await hash(userEditDTO.newPassword);

        await UserModel.updateOne({email: userEditDTO.email}, {
            email: userEditDTO.newEmail,
            password: userEditDTO.newPassword,
        })
    }

    public async verifyAndRestartToken(id: string, token: string): Promise<string> {
        const user = await UserModel.findById(id);

        if (!user) {
            throw new Unauthorized('wrong user id');
        }

        const tokenData = await verifyToken(token);

        if (!tokenData || tokenData.data !== id || user.token !== token) {
            throw new Unauthorized('invalid token');
        }

        if (tokenData.exp < Date.now() / 1000) {
            throw new Unauthorized('session expired');
        }

        if (tokenData.exp -config.exp + config.newTokenAfter < Date.now() / 1000) {
            token = await generateToken(id, Date.now() / 1000 + config.exp);
            await UserModel.updateOne(
                {_id: id},
                {token}
            );
            return token;
        }

        return token;
    }
}