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
import { getTimestampSeconds } from 'utils/time';
import { SomethingWentWrong } from 'errors/SomethingWentWrong';
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

        const isPasswordCorrect = await compare(userLoginDTO.password, user?.password || '');
        if (!isPasswordCorrect) {
            throw new Unauthorized('wrong email or password');
        }

        const token = await generateToken(user?._id, getTimestampSeconds() + config.tokenExpireTime)
        const userLoginResponseDTO: UserLoginResponseDTO =  {
            _id: user?._id,
            token
        }

        const updateResult = await UserModel.updateOne(
            {email: user.email},
            {token}
        );

        if (updateResult?.modifiedCount !== 1) {
            throw new SomethingWentWrong(JSON.stringify(updateResult));
        }

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

        const updateResult = await UserModel.updateOne({email: userEditDTO.email}, {
            email: userEditDTO.newEmail,
            password: userEditDTO.newPassword,
        });

        if (updateResult?.modifiedCount !== 1) {
            throw new SomethingWentWrong(JSON.stringify(updateResult));
        }
    }

    public async verifyToken(userID: string, token: string): Promise<void> {
        const user = await UserModel.findById(userID);

        if (!user) {
            throw new Unauthorized('wrong user id');
        }

        const tokenData = await verifyToken(token);

        if (!tokenData || tokenData.data !== userID || user.token !== token) {
            throw new Unauthorized('invalid token');
        }

        if (tokenData.expires < getTimestampSeconds()) {
            throw new Unauthorized('session expired');
        }

    }

    // not used yet - general question: how do we send back new token?
    // e.g. if we want to restart session when any authorized request occures 
    // this function returns old token or generates new one if it's near its expiration
    public async tryRestartToken(userID: string, token: string): Promise<string> {
        const tokenData = await verifyToken(token);

        if (tokenData.expires - config.tokenExpireTime + config.newTokenAfter < getTimestampSeconds()) {
            token = await generateToken(userID, getTimestampSeconds() + config.tokenExpireTime);
            const updateResult = await UserModel.updateOne(
                {_id: userID},
                {token}
            );

            if (updateResult?.modifiedCount !== 1) {
                throw new SomethingWentWrong(JSON.stringify(updateResult));
            }

            return token;
        }

        return token;
    }
}