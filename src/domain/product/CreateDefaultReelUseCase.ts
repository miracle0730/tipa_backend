import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType } from 'slonik';
import { IApplicationRepository } from '../application/IApplicationRepository';
import { ApplicationMap } from '../application/ApplicationMap';
import { ProductEntity } from './ProductEntity';
import { CategoryGetAllUseCase } from '../category/CategoryGetAllUseCase';
import { CategoryEntity, CategoryLevel, MainCategoryNames } from '../category/CategoryEntity';
import { CategoryCreateUseCase } from '../category/CategoryCreateUseCase';

export enum PackagingOrReelNames {
    PACKAGING = 'Packaging',
    REEL = 'Reel'
}

@injectable()
export class CreateDefaultReelUseCase implements IUseCase<number> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private applicationRepo: IApplicationRepository,
        @inject(CategoryGetAllUseCase) private categoryGetAllUseCase: IUseCase<CategoryEntity[]>,
        @inject(CategoryCreateUseCase) private categoryCreateUseCase: IUseCase<CategoryEntity>
    ) { }

    public async execute(product: ProductEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {
        try {
            const {
                id,
                title,
                stage,
                description,
                segment,
                thickness,
                technical_considerations,
                features,
                draft,
                terms_and_limitations,
                width,
                application,
                display_priority,
                packed_goods,
                segment_type,
                additional_features,
                level_of_clearance,
                certificates
            } = product;

            const categories = await this.categoryGetAllUseCase.execute();

            const applicationTypeCategory = categories.find(category => category.title === MainCategoryNames.APPLICATION_TYPE)

            const newApplicationTypeChild = await this.categoryCreateUseCase.execute({
                parent_id: applicationTypeCategory.id,
                level: CategoryLevel.SUB,
                title,
            })

            const applicationId = await this.applicationRepo.create(ApplicationMap.toDomain({
                type: newApplicationTypeChild.id,
                stage,
                description,
                application,
                segment,
                segment_type,
                packed_goods,
                product: [id],
                thickness,
                width,
                technical_considerations,
                features,
                draft,
                terms_and_limitations,
                display_priority,
                additional_features,
                fast_track: {},
                level_of_clearance: level_of_clearance || null,
                certificates
            }), tx);

            return applicationId;

        } catch (err) {
            this.logger.error(err);
        }

    }

}