import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { Stream } from './ApplicationDto';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

@injectable()
export class ExpandStreamUseCase implements IUseCase<Stream> {
    constructor() { }

    public execute(stream: Stream, { itemType, elementType }: IItemData): Stream {

        if (!stream) {
            return
        }

        return {
            type: stream.type || null,
            title: stream.title || null,
            file_url: stream.file_url ? `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${stream.file_url}` : null,
            site_url: stream.site_url || null,
            checked: stream.checked || false
        }

    }

}