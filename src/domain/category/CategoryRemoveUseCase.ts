import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { HttpError } from 'routing-controllers';
import { CategoryEntity, CategoryLevel, MainCategoryNames } from './CategoryEntity';
import { CategoryGetAllUseCase } from './CategoryGetAllUseCase';
import { CategoryGetOneUseCase } from './CategoryGetOneUseCase';
import { IApplicationRepository } from '../application/IApplicationRepository';
import { IProductRepository } from '../product/IProductRepository';
import { ICategoryRepository } from './ICategoryRepository';
import { ApplicationEntity } from '../application/ApplicationEntity';

@injectable()
export class CategoryRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CategoryRepository) private repo: ICategoryRepository,
        @inject(TYPES.ApplicationRepository) private applicationRepo: IApplicationRepository,
        @inject(TYPES.ProductRepository) private productRepo: IProductRepository,
        @inject(CategoryGetAllUseCase) private categoryGetAllUseCase: IUseCase<CategoryEntity[]>,
        @inject(CategoryGetOneUseCase) private categoryGetOneUseCase: IUseCase<CategoryEntity>,
    ) { }

    public async execute(id: number): Promise<void> {
        try {

            const categoryToRemove = await this.categoryGetOneUseCase.execute({ id });

            if (!categoryToRemove) {
                throw new HttpError(400, 'Category does not exist!');
            }

            if (categoryToRemove.level === CategoryLevel.MAIN || categoryToRemove.parent_id === 1) {
                throw new HttpError(400, 'You can not delete this category!');
            }

            const categories = await this.categoryGetAllUseCase.execute();

            let foundCategories: number[] = [];

            this.getAllChildrenOfOurCategoryIds(categoryToRemove.id, categories, foundCategories);

            foundCategories.push(categoryToRemove.id);

            const foundApplications = await this.applicationRepo.getByCategories(foundCategories);

            if (foundApplications.length) {
                throw new HttpError(400, 'You can not delete this category. You have applications which use it.');
            }

            const foundProducts = await this.productRepo.getByCategories(foundCategories);

            if (foundProducts.length) {
                throw new HttpError(400, 'You can not delete this category. You have products which use it.');
            }

            const additionalFeaturesCategory = categories
                .find(category => category.level === CategoryLevel.MAIN && category.title === MainCategoryNames.ADDITIONAL_FEATURES);
            const applicationTypeCategory = categories
                .find(category => category.level === CategoryLevel.MAIN && category.title === MainCategoryNames.APPLICATION_TYPE);

            if (applicationTypeCategory.id === categoryToRemove.parent_id) {
                const foundedApplication = await this.applicationRepo.getApplicationsByType(categoryToRemove.id);

                if (foundedApplication) {
                    throw new HttpError(400, 'You can not delete this application type. You have applications which use it.');
                }
            }

            const mainCategory = this.getMainCategory(categoryToRemove, categories);

            if (additionalFeaturesCategory.id === mainCategory.id) {

                for (const categoryId of foundCategories) {
                    const applicationsWithAdditionalFeatures = await this.applicationRepo.getAllByAdditionalFeatures(categoryId);
                    const uniqApplications = this.getUniqApplications(applicationsWithAdditionalFeatures);

                    for (const application of uniqApplications) {
                        application.additional_features.forEach(feature => {
                            if (feature.ids.includes(categoryId)) {
                                feature.ids = feature.ids.filter(item => item !== categoryId);
                            }
                        });
                        application.additional_features = application.additional_features.filter(feature => feature.ids.length !== 0);

                        await this.applicationRepo.update({ id: application.id }, { additional_features: application.additional_features });
                    }
                }
            }

            if (mainCategory.title === MainCategoryNames.CERTIFIED_BY) {
                const category = categories.find(category => category?.metadata?.certificate_certified_by === id);
                if (category) {
                    throw new HttpError(400, `You can not delete this category. Certificate: "${category.title}" uses it.`);
                }
            }

            if (mainCategory.title === MainCategoryNames.CERTIFICATES) {
                const applications = await this.applicationRepo.getAllByCertificateId(categoryToRemove.id);

                if (applications.length) {
                    throw new HttpError(400, `You can not delete this category. Application ID: "${applications[0].id}" uses it.`);
                }
                const products = await this.productRepo.getAllByCertificateId(categoryToRemove.id);

                if (products.length) {
                    throw new HttpError(400, `You can not delete this category. Product ID: "${products[0].id}" uses it.`);
                }
            }

            await this.repo.remove(id);

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    private getAllChildrenOfOurCategoryIds(categoryId: number, categories?: CategoryEntity[], foundCategories?: number[]) {

        const relatedCategories = categories.filter(category => category.parent_id === categoryId);

        if (!relatedCategories.length) {
            return;
        }

        relatedCategories.forEach(category => foundCategories.push(category.id))

        relatedCategories.forEach(category => {
            this.getAllChildrenOfOurCategoryIds(category.id, categories, foundCategories)
        });
    }

    private getUniqApplications(applicationsWithAdditionalFeatures: ApplicationEntity[]): ApplicationEntity[] {

        const uniqApplications: ApplicationEntity[] = [];

        const isUniq = (application_id) => !uniqApplications.some(application => application.id === application_id);

        const validateApplication = (application: ApplicationEntity) => {
            if (isUniq(application.id)) {
                uniqApplications.push(application);
            }
        };

        applicationsWithAdditionalFeatures.forEach(application => validateApplication(application));

        return uniqApplications;
    }

    private getMainCategory(categoryToRemove: CategoryEntity, categories: CategoryEntity[]): CategoryEntity {
        const foundedCategory = categories.find(category => categoryToRemove.parent_id === category.id);

        if (foundedCategory.level === CategoryLevel.MAIN) {
            return foundedCategory;
        }

        return this.getMainCategory(foundedCategory, categories);
    }

}