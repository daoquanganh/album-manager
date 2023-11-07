import { IsEnum, IsNotEmpty } from "class-validator";
import { MediaStatus } from "src/common/types/enum.type";
export class PhotoInfoDto {

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    status: MediaStatus

    @IsNotEmpty()
    name: string

}
