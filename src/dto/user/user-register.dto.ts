import { IsEmail, Length, IsString, IsIn } from "class-validator";
import { userRoles } from "../helpers/user-roles";

export class UserRegisterDTO {
    @IsEmail()
    @Length(2, 15)
    email: string;

    @IsString()
    @Length(8, 100)
    password: string;

    @IsString()
    @IsIn(userRoles)
    role: string;
}
