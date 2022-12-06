import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserRegisterDTO } from '@DTO/user/user-register.dto';
import { UserModel } from '@Database/mongo/models';
import { compare, generateToken, verifyToken } from '@Utils/crypt';
import { ILoggerService, IUserService } from './interfaces';
import { ValueAlreadyInUse } from '@Errors/ValueAlreadyInUse';
import { UserEditDTO } from '@DTO/user/user-edit.dto';
import { UserLoginResponseDTO } from '@DTO/user/user-login-response.dto';
import { config } from '@Utils/config';
import { Unauthorized } from '@Errors/Unauthorized';
import { getTimestampSeconds } from '@Utils/time';
import { SomethingWentWrong } from '@Errors/SomethingWentWrong';
import { UserLoginDTO } from '@DTO/user/user-login.dto';
import { UserEntity } from '@Entity/user.entity';
import { mapUserRegisterToUserEntity, mapUserDBOToUserEntity, mapUserEntityToUserDBO } from '@Mappers/user/user.mapper';
import { IUserRepository } from '@Database/interfaces/user.repository.interface';
import { DI_TYPES } from 'DI_TYPES';
import { UserDBO } from '@DBO/user.dbo';
import { IEmailService } from './interfaces/email.interface';
import { UserConfirmEmailDTO } from '@DTO/user/user-confirm-email.dto';
import { WrongData } from '@Errors/WrongData';

@injectable()
export class UserService implements IUserService {

    private readonly _userRepository: IUserRepository;
    private readonly _emailService: IEmailService;

    constructor(
        @inject(DI_TYPES.LoggerService) loggerService: ILoggerService,
        @inject(DI_TYPES.UserRepository) userRepository: IUserRepository,
        @inject(DI_TYPES.EmailService) emailService: IEmailService,
    ) {
        this._userRepository = userRepository;
        this._emailService = emailService;
    }

    public async register(userRegisterDTO: UserRegisterDTO): Promise<void> {
        const userEntity: UserEntity = mapUserRegisterToUserEntity(userRegisterDTO);

        const userSameEmail = await this._userRepository.findByEmail(userEntity.email);
        if (userSameEmail) {
            throw new ValueAlreadyInUse('email already taken');
        }

        await userEntity.hashPassword();

        const userDBO: UserDBO = mapUserEntityToUserDBO(userEntity);

        await this._userRepository.insertOne(userDBO);

        await this.sendEmailConfirmation(userDBO.email);
    }

    public async sendEmailConfirmation(email: string): Promise<void> {
        const userDBO = await this._userRepository.findByEmail(email);

        if (!userDBO?.id) {
            throw new WrongData(`user ${email} does not exist`);
        }

        if (userDBO?.status === 'active') {
            throw new WrongData('user email is already confirmed');
        }

        const userEntity: UserEntity = mapUserDBOToUserEntity(userDBO);

        userEntity.generateConfirmationCode();

        const userDBOUpdate: UserDBO = mapUserEntityToUserDBO(userEntity);

        await this._userRepository.updateOne(userDBOUpdate);

        await this._emailService.sendEmailConfirmationFromWorkspace(userDBOUpdate.confirmationCode, email);
    };

    public async confirmEmail(userConfirmEmailDTO: UserConfirmEmailDTO): Promise<void> {
        const userDBO = await this._userRepository.findByEmail(userConfirmEmailDTO.email);
        
        if (!userDBO?.id) {
            throw new WrongData('user does not exist');
        }

        if (userDBO?.confirmationCode !== userConfirmEmailDTO.code) {
            throw new WrongData('confirmation code does not match');
        }

        const userEntity: UserEntity = mapUserDBOToUserEntity(userDBO);

        userEntity.activate();

        const userDBOUpdate: UserDBO = mapUserEntityToUserDBO(userEntity);

        await this._userRepository.updateOne(userDBOUpdate);

    };

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
        const anyUserExists = await this._userRepository.findByEmail(userEditDTO.newEmail)
        if (anyUserExists?.email) {
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