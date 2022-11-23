import { IsEmail, Length, IsString, IsIn } from "class-validator";
import { userRoles } from "../helpers/user-roles";

export class UserEditDTO {
    email: string;

    @IsEmail()
    @Length(2, 15)
    newEmail: string;

    @IsString()
    @Length(8, 100)
    newPassword: string;

    @IsString()
    @IsIn(userRoles)
    newRole: string;
}
