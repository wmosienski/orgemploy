import { IsEmail, Length, IsString } from "class-validator";

export class UserEditDTO {
    email: string;

    @IsEmail()
    @Length(2, 15)
    newEmail: string;

    @IsString()
    @Length(8, 100)
    newPassword: string;
}
