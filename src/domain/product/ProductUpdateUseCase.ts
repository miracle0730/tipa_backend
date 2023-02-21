import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, UniqueIntegrityConstraintViolationError, InvalidInputError, SlonikError } from 'slonik';
import { IProductRepository } from './IProductRepository';
import { ProductUpdateDto } from './ProductDto';
import { LevelOfClearanceList, ProductEntity, Stage, StageList } from './ProductEntity';
import { ProductImageEntity } from '../image/product/ProductImageEntity';
import { ApplicationImageEntity } from '../image/application/IApplicationImageEntity';
import { ImageCreateOrUpdateUseCase } from '../image/ImageCreateOrUpdateUseCase';
import { ResourceTypeEnum } from '../image/ImageEntity';
import { ProductMap } from './ProductMap';
import { HttpError } from 'routing-controllers';
import { ApplicationDraftUseCase } from '../application/ApplicationDraftUseCase';
import { ApplicationPublishUseCase } from '../application/ApplicationPublishUseCase';
import { ApplicationGetByProductUseCase } from '../application/ApplicationGetByProduct';
import { ApplicationEntity } from '../application/ApplicationEntity';

@injectable()
export class ProductUpdateUseCase implements IUseCase<ProductEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductRepository) private repo: IProductRepository,
        @inject(ImageCreateOrUpdateUseCase) private imageCreateOrUpdateUseCase: IUseCase<ProductImageEntity | ApplicationImageEntity>,
        @inject(ApplicationDraftUseCase) private applicationDraftUseCase: IUseCase<void>,
        @inject(ApplicationPublishUseCase) private applicationPublishUseCase: IUseCase<void>,
        @inject(ApplicationGetByProductUseCase) private applicationGetByProductUseCase: IUseCase<ApplicationEntity[]>,
    ) { }

    public async execute(dto: ProductUpdateDto, id: number, tx?: DatabaseTransactionConnectionType): Promise<ProductEntity> {
        try {
            const product = ProductMap.toDomain(dto);

            const relatedApplications = await this.applicationGetByProductUseCase.execute(id);

            if (product?.stage === Stage.FUTURE_DEVELOPMENT && !product?.level_of_clearance) {
                throw new HttpError(400, 'Please select level of clearance!');
            }

            if (product?.stage !== Stage.FUTURE_DEVELOPMENT) {
                product.level_of_clearance = null;
            }

            const lowestStageLevelApplication = relatedApplications?.find(application =>
                StageList?.find(stage => application?.stage === stage?.id)?.level < StageList?.find(stage => product?.stage === stage?.id)?.level);

            if (lowestStageLevelApplication) {
                throw new HttpError(400, 'You can not change product stage, please update applications to the appropriate level of Stage!');
            }

            if (product?.stage === Stage.FUTURE_DEVELOPMENT) {
                const lowestLevelOfClearanceApplication = relatedApplications?.find(application =>
                    LevelOfClearanceList?.find(levelOfClearance => application?.level_of_clearance === levelOfClearance?.id)?.level <
                    LevelOfClearanceList?.find(levelOfClearance => product?.level_of_clearance === levelOfClearance?.id)?.level);

                if (lowestLevelOfClearanceApplication) {
                    throw new HttpError(400, 'You can not change product level of clearance, please update applications to the appropriate level of clearance!');
                }
            }

            delete product.id;
            delete product.created_at;

            const updatedProductId = await this.repo.update({ id }, product, tx);

            if (!updatedProductId) {
                return null;
            }

            await this.imageCreateOrUpdateUseCase.execute(ResourceTypeEnum.PRODUCT, updatedProductId, product.images);

            if (product.draft) {
                await this.applicationDraftUseCase.execute([updatedProductId]);
            } else {
                await this.applicationPublishUseCase.execute([updatedProductId]);
            }

            return await this.repo.getOne(updatedProductId);

        } catch (err) {
            this.logger.error(err);
            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Product must have a unique title!');
            }

            if (err instanceof InvalidInputError) {
                throw new HttpError(400, 'Some input fields are entered incorrectly!')
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The product has not been updated!')
            }

            throw err;
        }
    }
}