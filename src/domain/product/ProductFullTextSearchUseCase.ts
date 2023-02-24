import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType } from 'slonik';
import { ProductDto } from './ProductDto';
import { IProductRepository } from './IProductRepository';
import { ProductMap } from './ProductMap';

@injectable()
export class ProductFullTextSearchUseCase implements IUseCase<ProductDto[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository
    ) { }

    public async execute(query: string, tx?: DatabaseTransactionConnectionType): Promise<ProductDto[]> {
        try {

            const products = await this.repo.search(query)

            return products.map(ProductMap.toDto);

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}