import { IsEmail, IsNotEmpty } from "class-validator";

export class UserInfoDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    userName: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}