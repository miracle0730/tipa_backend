import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

export interface ITechnicalConsiderationDocument {
    description: string;
    url: string;
}


@injectable()
export class ExpandTechnicalConsiderationUseCase implements IUseCase<ITechnicalConsiderationDocument> {
    constructor() { }

    public execute(document: ITechnicalConsiderationDocument, { itemType, elementType }: IItemData): ITechnicalConsiderationDocument {
        if (!document) {
            return;
        }

        if (!document.url && !document.description) {
            return;
        }

        return {
            description: document.description || '',
            url: document.url ? `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${document.url}` : null
        }

    }

}