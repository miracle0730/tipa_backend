import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { CategoryEntity } from './CategoryEntity';
import { ICategoryRepository } from './ICategoryRepository';
import _ = require('lodash');

@injectable()
export class CategoryGetAllUseCase implements IUseCase<CategoryEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CategoryRepository) private repo: ICategoryRepository
    ) { }

    public async execute(): Promise<CategoryEntity[]> {
        try {

            return await this.repo.getAll();

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}