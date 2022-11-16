import { IsEmail, Length, IsString } from "class-validator";

export class UserRegisterDTO {
    @IsEmail()
    @Length(2, 15)
    email: string;

    @IsString()
    @Length(8, 100)
    password: string;
}
