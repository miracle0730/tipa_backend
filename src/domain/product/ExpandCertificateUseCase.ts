import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { Certification } from './ProductDto';
import { IItemData } from './ExpandDocumentUrlUseCase';

@injectable()
export class ExpandCertificateUseCase implements IUseCase<Certification> {
    constructor() { }

    public execute(certificate: Certification, { itemType, elementType }: IItemData): Certification {

        if (!certificate) {
            return
        }

        return {
            file_url: certificate.file_url ? `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${certificate.file_url}` : null,
            description: certificate.description,
            category_id: certificate.category_id,
            download: certificate.download
        }

    }

}