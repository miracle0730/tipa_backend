import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { IItemData } from './ExpandDocumentUrlUseCase';

export interface IBarrierDocument {
    description: string;
    url: string;
}


@injectable()
export class ExpandBarrierUseCase implements IUseCase<IBarrierDocument> {
    constructor() { }

    public execute(document: IBarrierDocument, { itemType, elementType }: IItemData): IBarrierDocument {
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