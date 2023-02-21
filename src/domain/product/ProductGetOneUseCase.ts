import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { IProductRepository } from './IProductRepository';
import { ProductEntity } from './ProductEntity';

@injectable()
export class ProductGetOneUseCase implements IUseCase<ProductEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository
    ) { }

    public async execute(id: number): Promise<ProductEntity> {
        try {
            const product = await this.repo.getOne(id);

            return product;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}