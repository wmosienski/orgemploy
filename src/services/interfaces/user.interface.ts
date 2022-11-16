import { UserRegisterDTO } from "@DTO/user-register.dto";
import { ErrorInfo } from "@Services/utils/error-info";

export interface IUserService {

    register: (userRegisterDTO: UserRegisterDTO) => Promise<any[] | ErrorInfo>;

}
