import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType } from 'slonik';
import { FullTextSearchDto } from './FullTextSearchDto';
import { ProductDto } from '../product/ProductDto';
import { ProductFullTextSearchUseCase } from '../product/ProductFullTextSearchUseCase';
import { ApplicationFullTextSearchUseCase } from '../application/ApplicationFullTextSearchUseCase';
import { ApplicationDto } from '../application/ApplicationDto';

@injectable()
export class FullTextSearchUseCase implements IUseCase<FullTextSearchDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ProductFullTextSearchUseCase) private productFullTextSearchUseCase: IUseCase<ProductDto[]>,
        @inject(ApplicationFullTextSearchUseCase) private applicationFullTextSearchUseCase: IUseCase<ApplicationDto[]>
    ) { }

    public async execute(query: string, tx?: DatabaseTransactionConnectionType): Promise<FullTextSearchDto> {
        try {
            if (query.length < 3) {
                return {
                    products: [],
                    applications: [],
                };
            }

            const productsPromise = this.productFullTextSearchUseCase.execute(query);

            const applicationsPromise = this.applicationFullTextSearchUseCase.execute(query);

            const [products, applications] = await Promise.all([productsPromise, applicationsPromise]);

            return { products, applications } as FullTextSearchDto;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

}