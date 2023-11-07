import { IsNotEmpty } from "class-validator";
import { UserInfoDto } from "./user-info.dto";

export class CommentDto {

    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    photoId: string

    @IsNotEmpty()
    content: string

}
