import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';

export interface IResourceDocument {
    url: string;
}

export interface IItemData {
    itemType: string;
    elementType?: string;
}

@injectable()
export class ExpandDocumentUrlUseCase implements IUseCase<IResourceDocument> {
    constructor() { }

    public execute(document: IResourceDocument, { itemType, elementType }: IItemData): IResourceDocument {

        if (!document || !document.url) {
            return
        }

        return {
            url: `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${document.url}`
        }

    }

}