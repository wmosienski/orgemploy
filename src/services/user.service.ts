import { UserRegisterDTO } from '@DTO/user/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { compare, generateToken, hash, verifyToken } from 'utils/crypt';
import { ILoggerService, IUserService } from './interfaces';
import { ValueAlreadyInUse } from 'errors/ValueAlreadyInUse';
import { UserEditDTO } from '@DTO/user/user-edit.dto';
import { UserLoginResponseDTO } from '@DTO/user/user-login-response.dto';
import { config } from 'utils/config';
import { Unauthorized } from 'errors/Unauthorized';
import { getTimestampSeconds } from 'utils/time';
import { SomethingWentWrong } from 'errors/SomethingWentWrong';
import { UserLoginDTO } from '@DTO/user/user-login.dto';
import { UserEntity } from 'entity/user.entity';
import { mapUserRegisterToUserEntity, mapUserToUserEntity } from '@DTO/mappers/user.dto.entity';
import { IUserRepository } from '@Database/interfaces/user.repository.interface';
import { DI_TYPES } from 'DI_TYPES';
import { UserDBO } from 'dbo/user.dbo';
import { mapUserDBOToUserEntity, mapUserEntityToUserDBO } from 'entity/mappers/user.entity.dbo';

@injectable()
export class UserService implements IUserService {

    private readonly _userRepository: IUserRepository;

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.UserRepository) userRepository: IUserRepository,
    ) {
        this._userRepository = userRepository;
    }

    public async register(userRegisterDTO: UserRegisterDTO): Promise<void> {
        const userEntity: UserEntity = mapUserRegisterToUserEntity(userRegisterDTO);

        const userSameEmail = await this._userRepository.findByEmail(userEntity.email);
        if (userSameEmail) {
            throw new ValueAlreadyInUse('email already taken');
        }

        await userEntity.hashPassword();

        const userDBO: UserDBO = mapUserEntityToUserDBO(userEntity);

        await this._userRepository.insertMany([userDBO]);
    }

    public async login(userLoginDTO: UserLoginDTO): Promise<UserLoginResponseDTO> {
        const userDBO = await this._userRepository.findByEmail(userLoginDTO.email);

        if (!userDBO?.id) {
            throw new Unauthorized('wrong email or password');
        }

        const isPasswordCorrect = await compare(userLoginDTO.password, userDBO?.password || '');
        if (!isPasswordCorrect) {
            throw new Unauthorized('wrong email or password');
        }

        const token = await generateToken(userDBO?.id, getTimestampSeconds() + config.tokenExpireTime)

        userDBO.token = token;

        const updateResult = await this._userRepository.updateOne(userDBO);

        if (!updateResult) {
            throw new SomethingWentWrong(JSON.stringify(updateResult));
        }

        const userLoginResponseDTO: UserLoginResponseDTO =  {
            _id: userDBO?.id,
            token
        }

        return userLoginResponseDTO;
    }

    public async edit(userEditDTO: UserEditDTO): Promise<void> {
        const anyUser = await this._userRepository.findByEmail(userEditDTO.newEmail)
        if (anyUser?.email) {
            throw new ValueAlreadyInUse('new email is already taken');
        }

        const userDBO = await this._userRepository.findByEmail(userEditDTO.email)
        if (!userDBO?.email) {
            throw new Unauthorized('user with the email does not exist');
        }

        const userEntity: UserEntity = mapUserDBOToUserEntity(userDBO);

        userEntity.email = userEditDTO.newEmail;
        userEntity.password = userEditDTO.newPassword;
        userEntity.role = userEditDTO.newRole;

        await userEntity.hashPassword();

        const userDBOUpdate = mapUserEntityToUserDBO(userEntity);

        const updateResult = await this._userRepository.updateOne(userDBOUpdate);

        if (!updateResult) {
            throw new SomethingWentWrong(JSON.stringify(updateResult));
        }
    }

    public async verifyToken(userID: string, token: string): Promise<void> {
        const user = await this._userRepository.findByID(userID);

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