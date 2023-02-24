import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { IItemData } from './ExpandDocumentUrlUseCase';

export interface IPrintabilityDocument {
    description: string;
    url: string;
}


@injectable()
export class ExpandPrintabilityUseCase implements IUseCase<IPrintabilityDocument> {
    constructor() { }

    public execute(document: IPrintabilityDocument, { itemType, elementType }: IItemData): IPrintabilityDocument {
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