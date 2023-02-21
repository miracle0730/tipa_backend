import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ProductEntity } from './ProductEntity';
import { IProductRepository } from './IProductRepository';

@injectable()
export class ProductGetAllUseCase implements IUseCase<ProductEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository
    ) { }

    public async execute(): Promise<ProductEntity[]> {
        try {

            return await this.repo.getAll();

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}