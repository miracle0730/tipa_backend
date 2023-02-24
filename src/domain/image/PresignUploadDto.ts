import { IsString, IsObject, IsOptional, ValidateNested } from 'class-validator';

export class PresignUploadFieldsDto {

    @IsString()
    key: string;

    @IsString()
    bucket: string;

    @IsString()
    'X-Amz-Algorithm': string;

    @IsString()
    'X-Amz-Credential': string;

    @IsString()
    'X-Amz-Date': string;

    @IsString()
    Policy: string;

    @IsString()
    'X-Amz-Signature': string;

}

export class PresignUploadDto {

    @IsString()
    url: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    fields: PresignUploadFieldsDto;

}

export class PresignUploadRequestDto {

    @IsString()
    fileName: string;

    @IsString()
    contentType: string;

}

export class PresignUploadQueryParams {

    @IsString()
    itemType: string;

    @IsString()
    fileType: string;

    @IsOptional()
    @IsString()
    elementType?: string;
}

