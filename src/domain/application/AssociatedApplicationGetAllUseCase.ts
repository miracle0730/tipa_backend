import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ApplicationEntity } from './ApplicationEntity';
import { ProductGetAllUseCase } from '../product/ProductGetAllUseCase';
import { ProductEntity } from '../product/ProductEntity';

@injectable()
export class AssociatedApplicationGetAllUseCase implements IUseCase<ApplicationEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ProductGetAllUseCase) private productGetAllUseCase: IUseCase<ProductEntity[]>
    ) { }

    public async execute(): Promise<ApplicationEntity[]> {
        try {
            const associatedApplications: ApplicationEntity[] = [];

            const products = await this.productGetAllUseCase.execute();

            for (const product of products) {

                let associatedApplication: ApplicationEntity = {
                    type: null,
                    stage: product.stage,
                    description: product.description,
                    images: [],
                    application: product.application,
                    segment: product.segment,
                    segment_type: product.segment_type,
                    packed_goods: product.packed_goods,
                    product: [product.id],
                    thickness: product.thickness,
                    width: product.width,
                    technical_considerations: product.technical_considerations,
                    features: product.features,
                    customers: [],
                    available_marketing_samples: [],
                    draft: product.draft,
                    additional_features: product.additional_features,
                    terms_and_limitations: product.terms_and_limitations,
                    rtf: product.rtf,
                    certifications: product.certifications,
                    level_of_clearance: product.level_of_clearance,
                    certificates: product.certificates
                }

                associatedApplications.push(associatedApplication);
            }

            return associatedApplications;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}