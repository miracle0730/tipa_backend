import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { IProductRepository } from './IProductRepository';
import { SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class ProductRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository
    ) { }

    public async execute(product_id: number): Promise<void> {
        try {

            await this.repo.remove(product_id);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The product has not been removed!')
            }

            throw err;
        }
    }
}