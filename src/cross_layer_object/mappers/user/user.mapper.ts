import { UserRegisterDTO } from "@DTO/user/user-register.dto";
import { UserDTO } from "@DTO/user/user.dto";
import { UserEntity } from "@Entity/user.entity";
import { UserDBO } from "@DBO/user.dbo";

export const mapUserDTOToUserEntity = (userDTO: UserDTO): UserEntity => {
    const userEntity = new UserEntity();
    userEntity.email = userDTO.email;
    userEntity.password = userDTO.password;
    userEntity.token = userDTO.token;
    userEntity.role = userDTO.role;
    userEntity.status = userDTO.status;
    userEntity.confirmationCode = userDTO.confirmationCode;
    return userEntity;
}

export const mapUserRegisterToUserEntity = (userRegisterDTO: UserRegisterDTO): UserEntity => {
    const userEntity = new UserEntity();
    userEntity.email = userRegisterDTO.email;
    userEntity.password = userRegisterDTO.password;
    userEntity.role = userRegisterDTO.role;
    return userEntity;
}

export const mapUserEntityToUserDBO = (userEntity: UserEntity): UserDBO => {
    const userDBO = new UserDBO();
    userDBO.id = userEntity.id;
    userDBO.email = userEntity.email;
    userDBO.password = userEntity.password;
    userDBO.token = userEntity.token;
    userDBO.role = userEntity.role;
    userDBO.status = userEntity.status;
    userDBO.confirmationCode = userEntity.confirmationCode;
    return userDBO;
}

export const mapUserDBOToUserEntity = (userDBO: UserDBO): UserEntity => {
    const userEntity = new UserEntity();
    userEntity.id = userDBO.id;
    userEntity.email = userDBO.email;
    userEntity.password = userDBO.password;
    userEntity.token = userDBO.token;
    userEntity.role = userDBO.role;
    userEntity.status = userDBO.status;
    userEntity.confirmationCode = userDBO.confirmationCode;
    return userEntity;
}