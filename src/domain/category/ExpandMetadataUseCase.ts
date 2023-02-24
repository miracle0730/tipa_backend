import {injectable} from 'inversify';
import {IUseCase} from '../IUseCase';
import {config} from '../../infra/config';
import {CategoryMetadata} from './CategoryDto';
import {IResourceImage} from '../image/ExpandImageUrlUseCase';
import {CategoryMetadataFileFieldsNames} from './CategoryEntity';

@injectable()
export class ExpandMetadataUseCase implements IUseCase<CategoryMetadata> {
    constructor() {
    }

    public execute(metadata: CategoryMetadata): CategoryMetadata {

        if (!metadata) {
            return;
        }

        return {
            hints: metadata.hints,
            film_grade: metadata.film_grade,
            certification_type: metadata.certification_type,
            certification_logo: metadata.certification_logo ? {
                id: metadata.certification_logo,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/images/${metadata.certification_logo}`
            } as IResourceImage : metadata.certification_logo,
            certification_file: metadata.certification_file ? {
                id: metadata.certification_file,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/documents/${metadata.certification_file}`
            } as IResourceImage : metadata.certification_file,
            application_type_logo: metadata.application_type_logo ? {
                id: metadata.application_type_logo,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.APPLICATION_TYPE}/images/${metadata.application_type_logo}`
            } as IResourceImage : metadata.application_type_logo,
            product_family_logo: metadata.product_family_logo ? {
                id: metadata.product_family_logo,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.PRODUCT_FAMILY}/images/${metadata.product_family_logo}`
            } as IResourceImage : metadata.product_family_logo,
            certificate_type: metadata.certificate_type,
            certificate_logo: metadata.certificate_logo ? {
                id: metadata.certificate_logo,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/images/${metadata.certificate_logo}`
            } as IResourceImage : metadata.certificate_logo,
            certificate_available_for: metadata.certificate_available_for,
            certificate_certified_by: metadata.certificate_certified_by,
            certificate_file: metadata.certificate_file ? {
                id: metadata.certificate_file,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/documents/${metadata.certificate_file}`
            } as IResourceImage : metadata.certificate_file,
            certificate_graphics: metadata.certificate_graphics ? metadata?.certificate_graphics?.map(cg => {
                return {
                    file: cg.file ? {
                        id: cg.file,
                        url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/documents/${cg.file}`
                    } as IResourceImage : cg.file,
                    preview_image: cg.preview_image ? {
                        id: cg.preview_image,
                        url: `https://${config.s3.bucket}.s3.amazonaws.com/${CategoryMetadataFileFieldsNames.CERTIFICATES}/images/${cg.preview_image}`
                    } as IResourceImage : cg.preview_image
                }
            }) : metadata.certificate_graphics,
            certified_by_website: metadata.certified_by_website,
            certified_by_relevant_locations: metadata.certified_by_relevant_locations,
            application_type_display_priority: metadata.application_type_display_priority,
            product_family_display_priority: metadata.product_family_display_priority,
            partner_owner: metadata.partner_owner,
            zoho_id: metadata.zoho_id
        }

    }

}