import { UserRegisterDTO } from "@DTO/user/user-register.dto";
import { UserDTO } from "@DTO/user/user.dto";
import { UserEntity } from "entity/user.entity";

export const mapUserToUserEntity = (userDTO: UserDTO): UserEntity => {
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