import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class SettingsCreateDto {

    @IsBoolean()
    @IsOptional()
    value: boolean;

}

export class SettingsUpdateDto {

    @IsBoolean()
    @IsOptional()
    value: boolean;
}

export class SettingsDto {
    @IsNumber()
    id: number;

    @IsNumber()
    title: number;

    @IsBoolean()
    @IsOptional()
    value: boolean;
}
