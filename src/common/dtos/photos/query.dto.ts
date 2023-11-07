
export class QueryDto {

    order: string = 'ASC' || 'DESC'

    filter: string = 'createdAt' || 'name'

    minLike: number = 0

}
