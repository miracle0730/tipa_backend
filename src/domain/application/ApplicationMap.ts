import moment = require('moment');

import { Mapper } from '../Mapper';
import { ApplicationEntity } from './ApplicationEntity';
import { ApplicationDto } from './ApplicationDto';
import { ExpandImageUrlUseCase } from '../image/ExpandImageUrlUseCase';
import { container } from '../../container';
import { ExpandDocumentUrlUseCase } from '../product/ExpandDocumentUrlUseCase';
import { ExpandCustomerUseCase } from './ExpandCustomerUseCase';
import { ResourceTypeEnum } from '../image/ImageEntity';
import { ExpandTechnicalConsiderationUseCase } from './ExpandTechnicalConsiderationUseCase';
import { ExpandAvailableMarketingSamplesUseCase } from './ExpandAvailableMarketingSamplesUseCase';
import { ExpandCertificateUseCase } from '../product/ExpandCertificateUseCase';
import { ExpandStreamUseCase } from './ExpandStreamUseCase';
import { ExpandFastTrackUseCase } from './ExpandFastTrackUseCase';

export class ApplicationMap extends Mapper<ApplicationEntity> {

    public static toDomain(raw: any): ApplicationEntity {
        if (!raw) return null;
        const expandFastTrackUseCase = container.get<ExpandFastTrackUseCase>(ExpandFastTrackUseCase);

        const entity = new ApplicationEntity();
        entity.id = raw.id;
        entity.type = raw.type;
        entity.stage = raw.stage;
        entity.description = raw.description || null;
        entity.images = raw.images;
        entity.application = raw.application;
        entity.segment = raw.segment || [];
        entity.segment_type = raw.segment_type || [];
        entity.packed_goods = raw.packed_goods || [];
        entity.product = raw.product;
        entity.thickness = raw.thickness || [];
        entity.width = raw.width || [];
        entity.height = raw.height || [];
        entity.production_process = raw.production_process || null;
        entity.tipa_production_site = raw.tipa_production_site || null;
        entity.technical_considerations = raw.technical_considerations || null;
        entity.features = raw.features || null;
        entity.positive_experiments = raw.positive_experiments || null;
        entity.negative_feedback_to_be_aware_of = raw.negative_feedback_to_be_aware_of || null;
        entity.dieline = raw.dieline || null;
        entity.customers = raw.customers || [];
        entity.available_marketing_samples = raw.available_marketing_samples || [];
        entity.draft = raw.draft || false;
        entity.additional_features = raw.additional_features || [];
        entity.terms_and_limitations = raw.terms_and_limitations || null;
        entity.display_priority = raw.display_priority || null;
        entity.rtf = raw.rtf || null;
        entity.certifications = raw.certifications || [];
        entity.marketing_doc = raw.marketing_doc || [];
        entity.certificatespecdoc = raw.certificatespecdoc || [];
        entity.streams = raw.streams || [];
        entity.fast_track = expandFastTrackUseCase.execute(raw.fast_track, {
            itemType: null,
            elementType: null
        }) || null;
        entity.level_of_clearance = raw.level_of_clearance || null;
        entity.certificates = raw.certificates || [];
        entity.created_at = raw.created_at || null;
        entity.updated_at = raw.updated_at || null;

        entity.printing_method = raw.printing_method || [];
        entity.partner_name = raw.partner_name || [];
        entity.production_site = raw.production_site || null;
        entity.notes_area = raw.notes_area || null;

        return entity;
    }

    public static toDto(entity: ApplicationEntity): ApplicationDto {
        if (!entity) return null;

        const expandImageUrlUseCase = container.get<ExpandImageUrlUseCase>(ExpandImageUrlUseCase);
        const expandDocumentUrlUseCase = container.get<ExpandDocumentUrlUseCase>(ExpandDocumentUrlUseCase);
        const expandCustomerUseCase = container.get<ExpandCustomerUseCase>(ExpandCustomerUseCase);
        const expandTechnicalConsiderationUseCase = container.get<ExpandTechnicalConsiderationUseCase>(ExpandTechnicalConsiderationUseCase);
        const expandAvailableMarketingSamplesUseCase = container.get<ExpandAvailableMarketingSamplesUseCase>(ExpandAvailableMarketingSamplesUseCase);
        const expandCertificateUseCase = container.get<ExpandCertificateUseCase>(ExpandCertificateUseCase);
        const expandStreamUseCase = container.get<ExpandStreamUseCase>(ExpandStreamUseCase);
        const expandFastTrackUseCase = container.get<ExpandFastTrackUseCase>(ExpandFastTrackUseCase);

        const dto = new ApplicationDto();
        dto.id = entity.id;
        dto.type = entity.type;
        dto.stage = entity.stage;
        dto.description = entity.description || null;
        dto.images = entity.images.map(image => {
            return expandImageUrlUseCase.execute(image, {
                itemType: ResourceTypeEnum.APPLICATION
            });
        }) || [];
        dto.application = entity.application;
        dto.segment = entity.segment || [];
        dto.segment_type = entity.segment_type || [];
        dto.packed_goods = entity.packed_goods || [];
        dto.product = entity.product;
        dto.thickness = entity.thickness || [];
        dto.width = entity.width || [];
        dto.height = entity.height || [];
        dto.production_process = entity.production_process || null;
        dto.tipa_production_site = entity.tipa_production_site || null;
        dto.technical_considerations = expandTechnicalConsiderationUseCase.execute(entity.technical_considerations, {
            itemType: ResourceTypeEnum.APPLICATION,
            elementType: ResourceTypeEnum.TECHNICAL_CONSIDERATIONS
        }) || null;
        dto.features = entity.features || null;
        dto.positive_experiments = entity.positive_experiments || null;
        dto.negative_feedback_to_be_aware_of = entity.negative_feedback_to_be_aware_of || null;
        dto.dieline = expandDocumentUrlUseCase.execute(entity.dieline, {
            itemType: ResourceTypeEnum.APPLICATION,
            elementType: ResourceTypeEnum.DIELINE
        }) || null;
        dto.customers = entity.customers.map((customer) => {
            return expandCustomerUseCase.execute(customer, {
                itemType: ResourceTypeEnum.APPLICATION,
                elementType: ResourceTypeEnum.CUSTOMERS
            });
        }) || [];
        dto.available_marketing_samples = entity.available_marketing_samples.map((available_marketing_sample) => {
            return expandAvailableMarketingSamplesUseCase.execute(available_marketing_sample, {
                itemType: ResourceTypeEnum.APPLICATION,
                elementType: ResourceTypeEnum.AVAILABLE_MARKETING_SAMPLES
            });
        }) || [];
        dto.draft = entity.draft || false;
        dto.additional_features = entity.additional_features || [];
        dto.terms_and_limitations = entity.terms_and_limitations || null;
        dto.display_priority = entity.display_priority || null;
        dto.rtf = entity.rtf || null;
        dto.certifications = entity.certifications.map(certificate => {
            return expandCertificateUseCase.execute(certificate, {
                itemType: ResourceTypeEnum.PRODUCT,
                elementType: ResourceTypeEnum.CERTIFICATES
            });
        }) || [];
        dto.marketing_doc = entity.marketing_doc.map(marketing_document => {
            return expandDocumentUrlUseCase.execute(marketing_document, {
                itemType: ResourceTypeEnum.APPLICATION,
                elementType: ResourceTypeEnum.MARKETINGDOC
            });
        }) || [];
        dto.certificatespecdoc = entity.certificatespecdoc.map(certificatespecdocument => {
            return expandDocumentUrlUseCase.execute(certificatespecdocument, {
                itemType: ResourceTypeEnum.APPLICATION,
                elementType: ResourceTypeEnum.CERTIFICATESPECDOC
            });
        }) || [];
        dto.streams = entity.streams?.map(stream => {
            return expandStreamUseCase.execute(stream, {
                itemType: ResourceTypeEnum.APPLICATION,
                elementType: ResourceTypeEnum.STREAMS
            });
        }) || [];
        dto.fast_track = expandFastTrackUseCase.execute(entity.fast_track, {
            itemType: ResourceTypeEnum.APPLICATION,
            elementType: ResourceTypeEnum.DIELINE
        }) || null;
        dto.level_of_clearance = entity.level_of_clearance || null;
        dto.certificates = entity.certificates || [];
        dto.created_at = moment.utc(entity.created_at).toISOString() || null;
        dto.updated_at = moment.utc(entity.updated_at).toISOString() || null;

        dto.printing_method = entity.printing_method || [];
        dto.partner_name = entity.partner_name || [];
        dto.production_site = entity.production_site || null;
        dto.notes_area = entity.notes_area || null;

        return dto;
    }
}