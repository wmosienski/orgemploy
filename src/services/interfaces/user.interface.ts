import { UserConfirmEmailDTO } from "@DTO/user/user-confirm-email.dto";
import { UserEditDTO } from "@DTO/user/user-edit.dto";
import { UserLoginResponseDTO } from "@DTO/user/user-login-response.dto";
import { UserLoginDTO } from "@DTO/user/user-login.dto";
import { UserRegisterDTO } from "@DTO/user/user-register.dto";

export interface IUserService {

    register: (userRegisterDTO: UserRegisterDTO) => Promise<void>;

    sendEmailConfirmation: (email: string) => Promise<void>;

    confirmEmail: (userConfirmEmailDTO: UserConfirmEmailDTO) => Promise<void>;

    login: (userRegisterDTO: UserLoginDTO) => Promise<UserLoginResponseDTO>;

    edit: (userRegisterDTO: UserEditDTO) => Promise<void>;

    verifyToken: (userID: string, token: string) => Promise<void>;

    tryRestartToken: (id: string, token: string) => Promise<string>;

}
