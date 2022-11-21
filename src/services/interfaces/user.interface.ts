import { UserEditDTO } from "@DTO/user/user-edit.dto";
import { UserLoginResponseDTO } from "@DTO/user/user-login-response.dto";
import { UserLoginDTO } from "@DTO/user/user-login.dto";
import { UserRegisterDTO } from "@DTO/user/user-register.dto";

export interface IUserService {

    register: (userRegisterDTO: UserRegisterDTO) => Promise<any[]>;

    login: (userRegisterDTO: UserLoginDTO) => Promise<UserLoginResponseDTO>;

    edit: (userRegisterDTO: UserEditDTO) => Promise<void>;

    verifyAndRestartToken: (id: string, token: string) => Promise<string>;

}
