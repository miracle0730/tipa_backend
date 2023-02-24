import { Mapper } from '../Mapper';
import { JWTTokenDecoded, UserEntity } from './UserEntity';
import { UserDto, UserSignUpDto, UserWithTokenDto } from './UserDto';
import moment = require('moment');
import * as _ from 'lodash';

export class UserMap extends Mapper<UserEntity> {
    public static toDomain(raw: any): UserEntity {
        if (!raw) return null;

        const entity = new UserEntity();
        entity.id = raw.id;
        entity.role = raw.role;
        entity.email = raw.email;
        entity.fullname = raw.fullname || '';
        entity.password = raw.password;
        entity.last_sign_in = raw.last_sign_in;

        return entity;
    }

    public static dbToDomain(raw: any): UserEntity {
        if (!raw) return null;

        const entity = new UserEntity();
        entity.id = raw.id;
        entity.role = raw.role;
        entity.email = raw.email;
        entity.fullname = raw.fullname || '';
        entity.password = raw.password;

        entity.createdAt = raw.created_at || null;
        entity.updatedAt = raw.updated_at || null;
        entity.last_sign_in = raw.last_sign_in || null;

        return entity;
    }

    public static toDto(entity: UserEntity): UserDto {
        if (!entity) return null;

        const dto = new UserDto();
        dto.id = entity.id;
        dto.role = entity.role;
        dto.email = entity.email;
        dto.fullname = entity.fullname || '';

        dto.createdAt = moment.utc(entity.createdAt).toISOString() || null;
        dto.updatedAt = moment.utc(entity.updatedAt).toISOString() || null;
        dto.last_sign_in = moment.utc(entity.last_sign_in).toISOString() || null;

        return dto;
    }

    public static toWithTokensDto(entity: UserEntity): UserWithTokenDto {
        if (!entity) return null;

        const dto = new UserWithTokenDto();
        dto.id = entity.id;
        dto.role = entity.role;
        dto.email = entity.email;
        dto.fullname = entity.fullname || '';

        if (entity.tokens) {
            dto.tokens = _.clone(entity.tokens);
        }

        dto.createdAt = moment.utc(entity.createdAt).toISOString() || null;
        dto.updatedAt = moment.utc(entity.updatedAt).toISOString() || null;
        dto.last_sign_in = moment.utc(entity.last_sign_in).toISOString() || null;

        return dto;
    }

}