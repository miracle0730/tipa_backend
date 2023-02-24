import { Mapper } from '../Mapper';
import moment = require('moment');
import _ = require('lodash');
import { ThicknessEntity } from './ThicknessEntity';
import { ThicknessDto } from './ThicknessDto';

export class ThicknessMap extends Mapper<ThicknessEntity> {

    public static toDomain(raw: any): ThicknessEntity {
        if (!raw) return null;

        const entity = new ThicknessEntity();
        entity.id = raw.id;
        entity.value = raw.value;

        return entity;
    }

    public static toDto(entity: ThicknessEntity): ThicknessDto {
        if (!entity) return null;

        const dto = new ThicknessDto();
        dto.id = entity.id;
        dto.value = entity.value;

        return dto;
    }
}