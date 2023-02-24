import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { CategoryCriteria, ICategoryRepository } from './ICategoryRepository';
import { CategoryEntity } from './CategoryEntity';

@injectable()
export class CategoryGetOneUseCase implements IUseCase<CategoryEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CategoryRepository) private repo: ICategoryRepository
    ) { }

    public async execute(criteria: CategoryCriteria): Promise<CategoryEntity> {
        try {
            const category = await this.repo.getOne(criteria);

            return category;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}