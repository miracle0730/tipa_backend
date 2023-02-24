import moment = require('moment');

import {Mapper} from '../Mapper';
import {ProductEntity} from './ProductEntity';
import {ProductDto} from './ProductDto';
import {container} from '../../container';
import {ExpandImageUrlUseCase} from '../image/ExpandImageUrlUseCase';
import {ExpandDocumentUrlUseCase} from './ExpandDocumentUrlUseCase';
import {ExpandCertificateUseCase} from './ExpandCertificateUseCase';
import {ResourceTypeEnum} from '../image/ImageEntity';
import {ExpandTechnicalConsiderationUseCase} from '../application/ExpandTechnicalConsiderationUseCase';
import {ExpandBarrierUseCase} from './ExpandBarrierUseCase';
import {ExpandPrintabilityUseCase} from './ExpandPrintabilityUseCase';

export class ProductMap extends Mapper<ProductEntity> {

    public static toDomain(raw: any): ProductEntity {
        if (!raw) return null;

        const entity = new ProductEntity();
        entity.id = raw.id;
        entity.title = raw.title;
        entity.stage = raw.stage;
        entity.description = raw.description || null;
        entity.images = raw.images;
        entity.family = raw.family;
        entity.segment = raw.segment;
        entity.segment_type = raw.segment_type || [];
        entity.thickness = raw.thickness || null;
        entity.width = raw.width || [];
        entity.features = raw.features || null;
        entity.technical_considerations = raw.technical_considerations || null;
        entity.tds = raw.tds || [];
        entity.msds = raw.msds || [];
        entity.collaterals = raw.collaterals || [];
        entity.certifications = raw.certifications || null;
        entity.draft = raw.draft || false;
        entity.terms_and_limitations = raw.terms_and_limitations || null;
        entity.manufacturing_technique = raw.manufacturing_technique || null;
        entity.application = raw.application || [];
        entity.display_priority = raw.display_priority || null;
        entity.barrier = raw.barrier || null;
        entity.printability = raw.printability || null;
        entity.rtf = raw.rtf || null;
        entity.printing_stage = raw.printing_stage;
        entity.packed_goods = raw.packed_goods || [];
        entity.additional_features = raw.additional_features || [];
        entity.level_of_clearance = raw.level_of_clearance || null;
        entity.certificates = raw.certificates || [];
        entity.created_at = raw.created_at || null;
        entity.updated_at = raw.updated_at || null;

        entity.printing_method = raw.printing_method || [];
        entity.available_territories = raw.available_territories || [];
        entity.moq = raw.moq || [];
        entity.partner_name = raw.partner_name || [];
        entity.production_site = raw.production_site || null;
        entity.notes_area = raw.notes_area || null;

        return entity;
    }

    public static toDto(entity: ProductEntity): ProductDto {
        if (!entity) return null;

        const expandImageUrlUseCase = container.get<ExpandImageUrlUseCase>(ExpandImageUrlUseCase);
        const expandDocumentUrlUseCase = container.get<ExpandDocumentUrlUseCase>(ExpandDocumentUrlUseCase);
        const expandCertificateUseCase = container.get<ExpandCertificateUseCase>(ExpandCertificateUseCase);
        const expandTechnicalConsiderationUseCase = container.get<ExpandTechnicalConsiderationUseCase>(ExpandTechnicalConsiderationUseCase);
        const expandBarrierUseCase = container.get<ExpandBarrierUseCase>(ExpandBarrierUseCase);
        const expandPrintabilityUseCase = container.get<ExpandPrintabilityUseCase>(ExpandPrintabilityUseCase);

        const dto = new ProductDto();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.stage = entity.stage;
        dto.description = entity.description || null;
        dto.images = entity.images.map(image => {
            return expandImageUrlUseCase.execute(image, {
                itemType: ResourceTypeEnum.PRODUCT
            });
        }) || [];
        dto.family = entity.family;
        dto.segment = entity.segment;
        dto.segment_type = entity.segment_type || [];
        dto.thickness = entity.thickness || [];
        dto.width = entity.width || [];
        dto.features = entity.features || null;
        dto.technical_considerations = expandTechnicalConsiderationUseCase.execute(entity.technical_considerations, {
            itemType: ResourceTypeEnum.PRODUCT,
            elementType: ResourceTypeEnum.TECHNICAL_CONSIDERATIONS
        }) || null;
        dto.tds = entity.tds.map(tds => {
            return expandDocumentUrlUseCase.execute(tds, {
                itemType: ResourceTypeEnum.PRODUCT,
                elementType: ResourceTypeEnum.TDS
            });
        }) || [];
        dto.msds = entity.msds.map(msds => {
            return expandDocumentUrlUseCase.execute(msds, {
                itemType: ResourceTypeEnum.PRODUCT,
                elementType: ResourceTypeEnum.MSDS
            });
        }) || [];
        dto.collaterals = entity.collaterals.map(collaterals => {
            return expandDocumentUrlUseCase.execute(collaterals, {
                itemType: ResourceTypeEnum.PRODUCT,
                elementType: ResourceTypeEnum.COLLATERALS
            });
        }) || [];
        dto.certifications = entity.certifications.map(certificate => {
            return expandCertificateUseCase.execute(certificate, {
                itemType: ResourceTypeEnum.PRODUCT,
                elementType: ResourceTypeEnum.CERTIFICATES
            });
        }) || [];
        dto.draft = entity.draft || false;
        dto.terms_and_limitations = entity.terms_and_limitations || null;
        dto.manufacturing_technique = entity.manufacturing_technique || null;
        dto.application = entity.application || [];
        dto.display_priority = entity.display_priority || null;
        dto.barrier = expandBarrierUseCase.execute(entity.barrier, {
            itemType: ResourceTypeEnum.PRODUCT,
            elementType: ResourceTypeEnum.BARRIER
        }) || null;
        dto.printability = expandPrintabilityUseCase.execute(entity.printability, {
            itemType: ResourceTypeEnum.PRODUCT,
            elementType: ResourceTypeEnum.PRINTABILITY
        }) || null;
        dto.rtf = entity.rtf || null;
        dto.printing_stage = entity.printing_stage;
        dto.packed_goods = entity.packed_goods || [];
        dto.additional_features = entity.additional_features || [];
        dto.level_of_clearance = entity.level_of_clearance || null;
        dto.certificates = entity.certificates || [];
        dto.created_at = moment.utc(entity.created_at).toISOString() || null;
        dto.updated_at = moment.utc(entity.updated_at).toISOString() || null;

        dto.printing_method = entity.printing_method || [];
        dto.available_territories = entity.available_territories || [];
        dto.moq = entity.moq || [];
        dto.partner_name = entity.partner_name || [];
        dto.production_site = entity.production_site || null;
        dto.notes_area = entity.notes_area || null;

        return dto;
    }
}