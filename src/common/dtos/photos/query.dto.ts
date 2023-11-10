import { IsNotEmpty } from "class-validator"

export class QueryDto {

    order: string = 'ASC' || 'DESC'

    filter: string = 'createdAt' || 'name'

    minLike: number = 0

    @IsNotEmpty()
    page: number

}
