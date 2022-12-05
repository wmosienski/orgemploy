import { IsEmail, Length, IsString } from "class-validator";

export class UserConfirmEmailDTO {
    @IsEmail()
    @Length(2, 35)
    email: string;

    @IsString()
    @Length(4)
    code: string;
}
