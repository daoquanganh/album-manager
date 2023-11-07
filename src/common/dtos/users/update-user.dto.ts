import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    userName: string;
    
    @IsEmail()
    email: string;
}
