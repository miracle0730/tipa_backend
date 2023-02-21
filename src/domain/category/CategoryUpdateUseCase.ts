import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, SlonikError } from 'slonik';
import { ICategoryRepository } from './ICategoryRepository';
import { CategoryUpdateDto } from './CategoryDto';
import { HttpError } from 'routing-controllers';
import { CategoryEntity, CategoryLevel, CategoryMetadataAvailableFieldNames } from './CategoryEntity';
import { CategoryMap } from './CategoryMap';
import { IApplicationRepository } from '../application/IApplicationRepository';
import { IProductRepository } from '../product/IProductRepository';

@injectable()
export class CategoryUpdateUseCase implements IUseCase<CategoryEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CategoryRepository) private repo: ICategoryRepository,
        @inject(TYPES.ApplicationRepository) private applicationRepo: IApplicationRepository,
        @inject(TYPES.ProductRepository) private productRepo: IProductRepository,
    ) { }

    public async execute(dto: CategoryUpdateDto, id: number, tx?: DatabaseTransactionConnectionType): Promise<CategoryEntity> {
        try {
            const { title, updated_at, metadata } = CategoryMap.toDomain(dto);

            const categoryToUpdate = await this.repo.getOne({ id });

            if (!categoryToUpdate) {
                throw new HttpError(400, 'Category does not exist!');
            }

            if (categoryToUpdate.level === CategoryLevel.MAIN || categoryToUpdate.parent_id === 1) {
                throw new HttpError(400, 'You can not update this category!');
            }

            if (!metadata?.certificate_available_for?.includes(CategoryMetadataAvailableFieldNames.APPLICATIONS)) {
                const applications = await this.applicationRepo.getAllByCertificateId(id);

                if (applications.length) {
                    throw new HttpError(400, `You can not update "available for" field for category. Application ID: "${applications[0].id}" uses this category.`);
                }
            }

            if (!metadata?.certificate_available_for?.includes(CategoryMetadataAvailableFieldNames.PRODUCTS)) {
                const products = await this.productRepo.getAllByCertificateId(id);

                if (products.length) {
                    throw new HttpError(400, `You can not update "available for" field for category. Product ID: "${products[0].id}" uses this category.`);
                }
            }

            await this.repo.update({ id }, { title, updated_at, metadata }, tx);

            return await this.repo.getOne({ id });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The category has not been updated!')
            }

            throw err;
        }

    }

}