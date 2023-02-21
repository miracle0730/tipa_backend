import { UserRole } from './UserEntity';
import { JSONSchema } from 'class-validator-jsonschema';
import {
    IsNumber,
    IsOptional,
    IsString,
    IsDateString,
    IsEmail,
    IsObject,
    ValidateNested,
    IsNotEmpty, MinLength, MaxLength
} from 'class-validator';

import { config } from '../../infra/config';

export class UserAccessTokensDto {
    @IsOptional()
    @IsString()
    @JSONSchema({
        description: 'JWT access token',
        example: 'aaa.bbb.ccc'
    })
    accessToken?: string;

    @IsOptional()
    @IsNumber()
    @JSONSchema({
        description: 'Unix timestamp when the token is expired'
    })
    expiresIn?: number;
}

export class UserDtoIn {

    @IsEmail()
    email: string;

    @IsString()
    fullname: string;

    @IsString()
    password: string;

    @IsNumber()
    role: UserRole;

}

export class UpdateUserDtoIn {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsString()
    fullname?: string;

    @IsOptional()
    @IsNumber()
    @JSONSchema({
        enum: [
            UserRole.ADMIN,
            UserRole.SALES,
            UserRole.COMMERCIAL
        ],
        description: `\n
        1 - administrator - write access\n
        2 - sales - read-only access\n,
        3 - commercial`,
        example: 2
    })
    role?: UserRole;

    @IsOptional()
    @IsString()
    @MinLength(config.auth.minPwdLength)
    @MaxLength(250)
    password?: string;

}

export class UserDto {

    @IsString()
    @JSONSchema({
        description: 'unique user id',
        example: 1
    })
    id: number;

    @IsNumber()
    @JSONSchema({
        enum: [
            UserRole.ADMIN,
            UserRole.SALES,
            UserRole.COMMERCIAL
        ],
        description: `\n
        1 - administrator - write access\n
        2 - sales - read-only access\n,
        3 - commercial`,
        example: 2
    })
    role: UserRole;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    fullname: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updatedAt?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    last_sign_in?: string;

}

export class UserWithTokenDto extends UserDto {

    @IsObject()
    @IsOptional()
    @ValidateNested()
    tokens?: UserAccessTokensDto;

}

export class UserSigninDto {
    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(250)
    password: string;
}

export class UserSignUpDto {
    @IsEmail()
    email: string;
}

export class UserSendEmailResponseDto {
    @IsString()
    @JSONSchema({
        example: 'message'
    })
    message: string;
}

export class UserCreateDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(config.auth.minPwdLength)
    @MaxLength(250)
    password?: string;

}

export class UserResetPasswordDto {

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(config.auth.minPwdLength)
    @MaxLength(250)
    password?: string;
}