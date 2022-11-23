import { UserEditDTO } from "@DTO/user-edit.dto";
import { UserLoginResponseDTO } from "@DTO/user-login-response.dto";
import { UserRegisterDTO } from "@DTO/user-register.dto";

export interface IUserService {

    register: (userRegisterDTO: UserRegisterDTO) => Promise<any[]>;

    login: (userRegisterDTO: UserRegisterDTO) => Promise<UserLoginResponseDTO>;

    edit: (userRegisterDTO: UserEditDTO) => Promise<void>;

    verifyToken: (userID: string, token: string) => Promise<void>;

    tryRestartToken: (id: string, token: string) => Promise<string>;

}
