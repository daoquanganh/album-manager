import { IsNotEmpty } from "class-validator";
import { UserInfoDto } from "./user-info.dto";

export class CreateUserDto extends UserInfoDto {

    @IsNotEmpty()
    otp: string
}
