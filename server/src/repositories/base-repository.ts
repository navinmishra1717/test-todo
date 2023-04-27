import { DestroyOptions, FindAndCountOptions, FindOptions, Model, ModelStatic, UpdateOptions } from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

abstract class BaseRepository<A extends {}, C extends {}, I extends Model<A, C>> {
  protected model: ModelStatic<I>;

  constructor(model: ModelStatic<I>) {
    this.model = model;
  }

  public find(query: FindOptions<A>): Promise<I[]> {
    return this.model.findAll(query);
  }

  public findOne(query: FindOptions<A>): Promise<I | null> {
    return this.model.findOne(query);
  }

  public create(data: MakeNullishOptional<C>): Promise<I> {
    return this.model.create(data);
  }

  public update(data: Partial<A>, query: UpdateOptions): Promise<[number]> {
    return this.model.update(data, query);
  }

  public findAndCountAll(options: FindAndCountOptions<A>): Promise<{
    rows: I[];
    count: number;
  }> {
    return this.model.findAndCountAll(options);
  }
  public delete(query: DestroyOptions): Promise<number> {
    return this.model.destroy(query);
  }
}

export default BaseRepository;
