import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { AvailableMarketingSamples } from './ApplicationDto';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

export interface IAvailableMarketingSamples {
    images: string[];
    description: string
}

export interface IAvailableMarketingSampleImages {
    id: string;
    url: string
}

@injectable()
export class ExpandAvailableMarketingSamplesUseCase implements IUseCase<AvailableMarketingSamples> {
    constructor() { }

    public execute(available_marketing_sample: IAvailableMarketingSamples, { itemType, elementType }: IItemData): AvailableMarketingSamples {

        if (!available_marketing_sample) {
            return
        }

        const images = available_marketing_sample.images.map((image): IAvailableMarketingSampleImages => {
            return {
                id: image,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/images/${elementType}/${image}`
            };
        });

        return {
            images,
            description: available_marketing_sample.description
        };

    }

}