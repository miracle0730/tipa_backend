import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

export interface IResourceImage {
    id: string;
    url: string;
}

@injectable()
export class ExpandImageUrlUseCase implements IUseCase<IResourceImage> {
    constructor() { }

    public execute(image: string, { itemType }: IItemData): IResourceImage {

        if (!image) {
            return
        }

        return {
            id: image,
            url: `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/images/${image}`
        };

    }

}