import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { IProductImageRepository } from './product/IProductImageRepository';
import { ResourceTypeEnum } from './ImageEntity';
import { IApplicationImageRepository } from './application/IApplicationImageRepository';
import { SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class ImageCreateOrUpdateUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ProductImageRepository) private productImageRepo: IProductImageRepository,
        @inject(TYPES.ApplicationImageRepository) private applicationImageRepo: IApplicationImageRepository
    ) { }

    public async execute(resourceType: ResourceTypeEnum, resourceTypeId: number, images: string[]): Promise<void> {
        try {

            switch (resourceType) {
                case ResourceTypeEnum.PRODUCT:
                    await this.productImageCreateOrUpdate(resourceTypeId, images);
                    break;
                case ResourceTypeEnum.APPLICATION:
                    await this.applicationImageCreateOrUpdate(resourceTypeId, images);
                    break;
                default:
                    throw new Error('ResourceType not handled');
            }

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'Images has not been added!')
            }

            throw err;
        }
    }

    private async productImageCreateOrUpdate(resourceId: number, images: string[]): Promise<void> {

        await this.productImageRepo.remove(resourceId);

        if (images?.length) {

            await this.productImageRepo.create({ images, product_id: resourceId });

        }

    }

    private async applicationImageCreateOrUpdate(resourceId: number, images: string[]): Promise<void> {

        await this.applicationImageRepo.remove(resourceId);

        if (images?.length) {

            await this.applicationImageRepo.create({ images, application_id: resourceId });

        }
    }

}