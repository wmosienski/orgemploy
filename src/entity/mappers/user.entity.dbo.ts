import { UserDBO } from "dbo/user.dbo";
import { UserEntity } from "entity/user.entity";

export const mapUserEntityToUserDBO = (userEntity: UserEntity): UserDBO => {
    const userDBO = new UserDBO();
    userDBO.id = userEntity.id;
    userDBO.email = userEntity.email;
    userDBO.password = userEntity.password;
    userDBO.token = userEntity.token;
    userDBO.role = userEntity.role;
    return userDBO;
}

export const mapUserDBOToUserEntity = (userDBO: UserDBO): UserEntity => {
    const userEntity = new UserEntity();
    userEntity.id = userDBO.id;
    userEntity.email = userDBO.email;
    userEntity.password = userDBO.password;
    userEntity.token = userDBO.token;
    userEntity.role = userDBO.role;
    return userEntity;
}