import { UserRegisterDTO } from "@DTO/user-register.dto";

export interface IUserService {

    register: (userRegisterDTO: UserRegisterDTO) => Promise<any[] | void | string>;

}
