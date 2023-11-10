export interface IBaseService<Entity>  {
    findAll(): Promise<Entity[]>;
    findById(id: string, relationOptions: string[]): Promise<Entity>;
    update(id: string, updateData: Entity): Promise<Entity>;
    create(entity: Entity): Promise<Entity>;
    delete(id: string);
}