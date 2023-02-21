import { Mapper } from '../Mapper';
import { CategoryDto } from './CategoryDto';
import moment = require('moment');
import { CategoryEntity } from './CategoryEntity';
import _ = require('lodash');
import { container } from '../../container';
import { ResourceTypeEnum } from '../image/ImageEntity';
import { ExpandMetadataUseCase } from './ExpandMetadataUseCase';

export class CategoryMap extends Mapper<CategoryEntity> {

    public static toDomain(raw: any): CategoryEntity {
        if (!raw) return null;

        const entity = new CategoryEntity();
        entity.id = raw.id;
        entity.parent_id = raw.parent_id;
        entity.level = raw.level;
        entity.title = raw.title;
        entity.metadata = raw.metadata || {};
        entity.created_at = raw.created_at || null;
        entity.updated_at = raw.updated_at || null;

        return entity;
    }

    public static toDto(entity: CategoryEntity): CategoryDto {
        if (!entity) return null;

        const expandMetadataUseCase = container.get<ExpandMetadataUseCase>(ExpandMetadataUseCase);

        const dto = new CategoryDto();
        dto.id = entity.id;
        dto.parent_id = entity.parent_id || null;
        dto.level = entity.level;
        dto.title = entity.title;
        dto.metadata = expandMetadataUseCase.execute(entity.metadata) || {};
        dto.created_at = moment.utc(entity.created_at).toISOString() || null;
        dto.updated_at = moment.utc(entity.updated_at).toISOString() || null;

        return dto;
    }
}