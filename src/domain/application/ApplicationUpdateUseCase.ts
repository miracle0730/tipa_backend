import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, UniqueIntegrityConstraintViolationError, InvalidInputError, SlonikError } from 'slonik';
import { ProductImageEntity } from '../image/product/ProductImageEntity';
import { ApplicationImageEntity } from '../image/application/IApplicationImageEntity';
import { ImageCreateOrUpdateUseCase } from '../image/ImageCreateOrUpdateUseCase';
import { ResourceTypeEnum } from '../image/ImageEntity';
import { ApplicationEntity } from './ApplicationEntity';
import { IApplicationRepository } from './IApplicationRepository';
import { ApplicationUpdateDto } from './ApplicationDto';
import { ApplicationMap } from './ApplicationMap';
import { HttpError } from 'routing-controllers';
import { ProductGetOneUseCase } from '../product/ProductGetOneUseCase';
import { ApplicationCheckApplicationNumberUseCase } from './ApplicationCheckApplicationNumberUseCase';
import { LevelOfClearanceList, Stage, StageList } from '../product/ProductEntity';

@injectable()
export class ApplicationUpdateUseCase implements IUseCase<ApplicationEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository,
        @inject(ImageCreateOrUpdateUseCase) private imageCreateOrUpdateUseCase: IUseCase<ProductImageEntity | ApplicationImageEntity>,
        @inject(ApplicationCheckApplicationNumberUseCase) private applicationCheckApplicationNumberUseCase: IUseCase<void>,
        @inject(ProductGetOneUseCase) private productGetOneUseCase: ProductGetOneUseCase
    ) { }

    public async execute(dto: ApplicationUpdateDto, id: number, tx?: DatabaseTransactionConnectionType): Promise<ApplicationEntity> {
        try {
            const application = ApplicationMap.toDomain(dto);

            if (application?.stage === Stage.FUTURE_DEVELOPMENT && !application?.level_of_clearance) {
                throw new HttpError(400, 'Please select level of clearance!');
            }

            if (application?.stage !== Stage.FUTURE_DEVELOPMENT) {
                application.level_of_clearance = null;
            }

            const product = await this.productGetOneUseCase.execute(application?.product[0]);

            if (StageList?.find(stage => product?.stage === stage?.id)?.level > StageList?.find(stage => application?.stage === stage?.id)?.level) {
                throw new HttpError(400, 'You can not create an application because Stage unsuitable for this product!');
            }

            if (LevelOfClearanceList?.find(levelOfClearance => product?.level_of_clearance === levelOfClearance?.id)?.level >
                LevelOfClearanceList?.find(levelOfClearance => application?.level_of_clearance === levelOfClearance?.id)?.level) {
                throw new HttpError(400, 'You can not create an application because Level of clearance unsuitable for this product!');
            }

            delete application.id;
            delete application.created_at;

            if (application?.fast_track?.application_number) {
                await this.applicationCheckApplicationNumberUseCase
                    .execute({ application_number: application.fast_track.application_number, application_id: id });
            }

            if (!application?.fast_track?.items?.find(item => item?.code?.slice(2, 4) === application?.fast_track?.application_number)
                && application?.fast_track?.items?.length
                && application?.fast_track?.application_number) {
                throw new HttpError(400, 'You can not update this application.');
            }

            if (application.draft === false && product?.draft) {
                throw new HttpError(400, 'You can not publish application that uses draft product! Please publish product first.');
            }

            const updatedApplicationId = await this.repo.update({ id }, application, tx);

            if (!updatedApplicationId) {
                return null;
            }

            await this.imageCreateOrUpdateUseCase.execute(ResourceTypeEnum.APPLICATION, updatedApplicationId, application.images);

            return await this.repo.getOne(updatedApplicationId);

        } catch (err) {
            this.logger.error(err);
            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Application must have a unique title!');
            }

            if (err instanceof InvalidInputError) {
                throw new HttpError(400, 'Some input fields are entered incorrectly!')
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The Application has not been updated!')
            }

            throw err;
        }
    }
}