import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, UniqueIntegrityConstraintViolationError, InvalidInputError, SlonikError } from 'slonik';
import { IProductRepository } from './IProductRepository';
import { ProductCreateDto } from './ProductDto';
import { ProductMap } from './ProductMap';
import { ImageCreateOrUpdateUseCase } from '../image/ImageCreateOrUpdateUseCase';
import { ProductImageEntity } from '../image/product/ProductImageEntity';
import { ApplicationImageEntity } from '../image/application/IApplicationImageEntity';
import { ResourceTypeEnum } from '../image/ImageEntity';
import { HttpError } from 'routing-controllers';
import { ProductEntity, Stage } from './ProductEntity';
import { ProductGetOneUseCase } from './ProductGetOneUseCase';

@injectable()
export class ProductCreateUseCase implements IUseCase<ProductEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository,
        @inject(ImageCreateOrUpdateUseCase) private imageCreateOrUpdateUseCase: IUseCase<ApplicationImageEntity | ProductImageEntity>,
        @inject(ProductGetOneUseCase) private productGetOneUseCase: IUseCase<ProductEntity>
    ) { }

    public async execute(dto: ProductCreateDto, tx?: DatabaseTransactionConnectionType): Promise<ProductEntity> {
        try {

            const productEntity = ProductMap.toDomain(dto);

            if (productEntity?.stage === Stage.FUTURE_DEVELOPMENT && !productEntity?.level_of_clearance) {
                throw new HttpError(400, 'Please select level of clearance!');
            }

            if (productEntity?.stage !== Stage.FUTURE_DEVELOPMENT) {
                productEntity.level_of_clearance = null;
            }

            const productId = await this.repo.create(productEntity, tx);

            await this.imageCreateOrUpdateUseCase.execute(ResourceTypeEnum.PRODUCT, productId, productEntity.images);

            return await this.productGetOneUseCase.execute(productId);

        } catch (err) {
            this.logger.error(err);
            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Product must have a unique title!');
            }

            if (err instanceof InvalidInputError) {
                throw new HttpError(400, 'Some input fields are entered incorrectly!')
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The product has not been created!')
            }

            throw err;
        }

    }

}