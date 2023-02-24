import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { ApplicationDto } from '../application/ApplicationDto';
import { ProductDto } from '../product/ProductDto';
import { Type } from 'class-transformer';

export class FullTextSearchDto {

    @IsOptional()
    @IsArray({ each: true })
    @ValidateNested({ each: true })
    @Type(() => ApplicationDto)
    applications: ApplicationDto[];

    @IsOptional()
    @IsArray({ each: true })
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    products: ProductDto[]

}