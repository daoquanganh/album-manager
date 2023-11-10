import { BaseEntity, ObjectLiteral, Repository } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { IBaseService } from './ibase.service';

export abstract class BaseService<Entity extends CustomBaseEntity> implements IBaseService<Entity> {
  constructor(private readonly repository: Repository<Entity>) {}

  async findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async findById(id: any, relationOptions?: string[]): Promise<Entity> {
    return await this.repository.findOne({where:{id}, relations: relationOptions});
  }

  async create(data: Partial<Entity>): Promise<Entity> {
    const entity = this.repository.create(data as Entity);
    return this.repository.save(entity);
  }

  async update(id: any, updateData: any): Promise<Entity> {
    this.repository.findOneBy({id})
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

}