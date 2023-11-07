import { IsEmail, IsNotEmpty } from "class-validator";

export class SaveUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    userName: string;
    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    status: string;

}
