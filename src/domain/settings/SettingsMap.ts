import { Mapper } from '../Mapper';
import moment = require('moment');
import _ = require('lodash');
import { SettingsEntity } from './SettingsEntity';
import { SettingsDto } from './SettingsDto';

export class SettingsMap extends Mapper<SettingsEntity> {

    public static toDomain(raw: any): SettingsEntity {
        if (!raw) return null;

        const entity = new SettingsEntity();
        entity.id = raw.id;
        entity.title = raw.title;
        entity.value = raw.value;

        return entity;
    }

    public static toDto(entity: SettingsEntity): SettingsDto {
        if (!entity) return null;

        const dto = new SettingsDto();
        dto.id = entity.id;
        dto.title = entity.title;
        dto.value = entity.value;

        return dto;
    }
}