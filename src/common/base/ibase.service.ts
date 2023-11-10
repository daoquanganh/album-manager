import { QueryDto } from "../dtos/photos/query.dto";

export interface IBaseService<Entity>  {
    findAll(): Promise<Entity[]>;
    findById(id: string, relationOptions: string[]): Promise<Entity>;
    // update(id: string, updateData: Entity): Promise<Entity>;
    // create(entity: Entity): Promise<Entity>;
    // delete(id: string): Promise<void>;
    // pagination(query: QueryDto): Promise<{data: Entity[], total: number}>
}