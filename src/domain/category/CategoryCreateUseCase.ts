import {inject, injectable} from 'inversify';
import {IUseCase} from '../IUseCase';
import {TYPES} from '../../container';
import {ILogger} from '../ILogger';
import {DatabaseTransactionConnectionType, SlonikError} from 'slonik';
import {ICategoryRepository} from './ICategoryRepository';
import {CategoryCreateDto} from './CategoryDto';
import {CategoryMap} from './CategoryMap';
import {HttpError} from 'routing-controllers';
import {CategoryEntity, MainCategoryNames} from './CategoryEntity';
import {CategoryGetOneUseCase} from './CategoryGetOneUseCase';
import {CategoryGetAllUseCase} from './CategoryGetAllUseCase';

export enum MaxLevelCategories {
    APPLICATION = 3,
    PRODUCT_FAMILY = 2,
    SEGMENTS = 4,
    APPLICATION_TYPE = 2,
    ADDITIONAL_FEATURES = 3,
    CORE = 2,
    COMPOSTABILITY_LOGOS = 3,
    FOOD_CONTACTS = 2,
    CERTIFIED_BY = 2,
    CERTIFICATES = 2,
    PARTNERS = 2,
    TERRITORIES = 2,
    MEASURE_UNIT = 2,
    PRINTING_METHOD = 2,
}

export enum MainCategoryIds {
    APPLICATION = 1,
    PRODUCT = 2,
    SEGMENT = 3
}

@injectable()
export class CategoryCreateUseCase implements IUseCase<CategoryEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CategoryRepository) private repo: ICategoryRepository,
        @inject(CategoryGetOneUseCase) private categoryGetOneUseCase: IUseCase<CategoryEntity>,
        @inject(CategoryGetAllUseCase) private categoryGetAllUseCase: IUseCase<CategoryEntity[]>
    ) {
    }

    public async execute(dto: CategoryCreateDto, tx?: DatabaseTransactionConnectionType): Promise<CategoryEntity> {
        try {
            const categoryEntity = CategoryMap.toDomain(dto);

            const categories = await this.categoryGetAllUseCase.execute();

            const parentCategory = categories.find(category => categoryEntity.parent_id === category.id);

            if (!parentCategory || parentCategory.id === MainCategoryIds.APPLICATION) {
                throw new HttpError(400, 'You can not create this category!');
            }

            const topParentCategory = this.getTopParentForCategory(parentCategory, categories);

            const maxAllowedLevel = this.getMaxAllowedCategoryLevel(topParentCategory);

            if (parentCategory.level + 1 <= maxAllowedLevel) {
                categoryEntity.level = parentCategory.level + 1;
            } else {
                throw new HttpError(400, 'You can not create sub-category for this category!');
            }

            const categoryId = await this.repo.create(categoryEntity, tx);

            return await this.categoryGetOneUseCase.execute({id: categoryId});

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The category has not been created!')
            }

            throw err;
        }

    }

    private getTopParentForCategory(categoryToRemove: CategoryEntity, categories: CategoryEntity[]): CategoryEntity {

        if (categoryToRemove.level === 1) {
            return categoryToRemove;
        }
        const parent = categories.find(category => category.id === categoryToRemove.parent_id);

        return this.getTopParentForCategory(parent, categories);
    }

    private getMaxAllowedCategoryLevel(topParentCategory: CategoryEntity): number {

        switch (topParentCategory.title) {
            case MainCategoryNames.APPLICATION:
                return MaxLevelCategories.APPLICATION;
            case MainCategoryNames.PRODUCT_FAMILY:
                return MaxLevelCategories.PRODUCT_FAMILY;
            case MainCategoryNames.SEGMENTS:
                return MaxLevelCategories.SEGMENTS;
            case MainCategoryNames.APPLICATION_TYPE:
                return MaxLevelCategories.APPLICATION_TYPE;
            case MainCategoryNames.ADDITIONAL_FEATURES:
                return MaxLevelCategories.ADDITIONAL_FEATURES;
            case MainCategoryNames.CORE:
                return MaxLevelCategories.CORE;
            case MainCategoryNames.COMPOSTABILITY_LOGOS:
                return MaxLevelCategories.COMPOSTABILITY_LOGOS;
            case MainCategoryNames.FOOD_CONTACTS:
                return MaxLevelCategories.FOOD_CONTACTS;
            case MainCategoryNames.CERTIFIED_BY:
                return MaxLevelCategories.CERTIFIED_BY;
            case MainCategoryNames.CERTIFICATES:
                return MaxLevelCategories.CERTIFICATES;
            case MainCategoryNames.PARTNERS:
                return MaxLevelCategories.PARTNERS;
            case MainCategoryNames.TERRITORIES:
                return MaxLevelCategories.TERRITORIES;
            case MainCategoryNames.MEASURE_UNIT:
                return MaxLevelCategories.MEASURE_UNIT;
            case MainCategoryNames.PRINTING_METHOD:
                return MaxLevelCategories.PRINTING_METHOD;
            default:
                break;
        }

    }

}