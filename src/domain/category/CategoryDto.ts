import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsNumber, ValidateNested, IsObject, IsBoolean, MaxLength, IsArray } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { IResourceImage } from '../image/ExpandImageUrlUseCase';
import { ApplicationCategoryLevel, CategoryLevel, CategoryMetadataAvailableFieldNames, FilmGrade, SegmentCategoryLevel } from './CategoryEntity';

export class AdditionalFeatureHint {

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    @JSONSchema({
        description: `Only for additional features`,
    })
    title: string;

}

export class CertificatesGraphics {

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'Preview image field is too long',
    })
    preview_image?: string | IResourceImage;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'file field is too long',
    })
    file?: string | IResourceImage;

}
export class CategoryMetadata {

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AdditionalFeatureHint)
    hints?: AdditionalFeatureHint[];

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        enum: [
            FilmGrade.FOOD_GRADE,
            FilmGrade.DRY_FOOD,
            FilmGrade.NON_FOOD,
        ],
        description: `\n
        1 - Food Grade\n
        2 - Dry Food\n
        3 - Non Food\n`,
        example: 1
    })
    film_grade?: number;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'Industrial' || 'Home'
    })
    @MaxLength(250, {
        message: 'Certification type field is too long',
    })
    certification_type?: string;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'Certification logo field is too long',
    })
    certification_logo?: string | IResourceImage;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'tdgr3we323fsdf6ddfd.ai'
    })
    @MaxLength(250, {
        message: 'Certification file field is too long',
    })
    certification_file?: string | IResourceImage;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'Application type logo field is too long',
    })
    application_type_logo?: string | IResourceImage;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'Product family logo field is too long',
    })
    product_family_logo?: string | IResourceImage;

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        description: `1 - Industrial Compostable \n
                      2 - Home Compostable \n
                      3 - TIPA Certified`,
        example: 1
    })
    certificate_type?: number;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'sdgr3we323fsdf6d.jpg'
    })
    @MaxLength(250, {
        message: 'Certificates logo field is too long',
    })
    certificate_logo?: string | IResourceImage;

    @IsArray()
    @IsOptional()
    @JSONSchema({
        description: '1 - Applications, 2 - Products',
        example: [1, 3]
    })
    @IsNumber({}, { each: true })
    certificate_available_for?: CategoryMetadataAvailableFieldNames[];

    @IsOptional()
    @JSONSchema({
        description: 'certified by ID (category_id)',
        example: 1
    })
    @IsNumber()
    certificate_certified_by?: number;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'tdgr3we323fsdf6ddfd.ai'
    })
    @MaxLength(250, {
        message: 'Certificates file field is too long',
    })
    certificate_file?: string | IResourceImage;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CertificatesGraphics)
    certificate_graphics?: CertificatesGraphics[];

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Certified by website field is too long',
    })
    certified_by_website?: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Certified by relevant location field is too long',
    })
    certified_by_relevant_locations?: string;

    @IsNumber()
    @IsOptional()
    application_type_display_priority?: number;

    @IsNumber()
    @IsOptional()
    product_family_display_priority?: number;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Partner Owner field is too long',
    })
    partner_owner?: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Zoho Id website field is too long',
    })
    zoho_id?: string;

}

export class CategoryCreateDto {

    @IsString()
    @JSONSchema({
        example: 'Dry Food'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsNumber()
    parent_id: number;

    @IsNumber()
    @JSONSchema({
        enum: [
            CategoryLevel.ROOT,
            CategoryLevel.MAIN,
            CategoryLevel.SUB
        ],
        description: `\n
        0 - Root\n
        1 - Main\n
        2 - Sub\n`,
        example: 1
    })
    level: CategoryLevel;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => CategoryMetadata)
    metadata: CategoryMetadata;
}

export class CategoryUpdateDto {

    @IsString()
    @JSONSchema({
        example: 'Dry Food'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => CategoryMetadata)
    metadata: CategoryMetadata;
}

export class CategoryDto {
    @IsNumber()
    id: number;

    @IsNumber()
    parent_id: number;

    @IsNumber()
    @JSONSchema({
        enum: [
            CategoryLevel.ROOT,
            CategoryLevel.MAIN,
            CategoryLevel.SUB
        ],
        description: `\n
        0 - Root\n
        1 - Main\n
        2 - Sub\n`,
        example: 1
    })
    level: CategoryLevel | ApplicationCategoryLevel | SegmentCategoryLevel;

    @IsString()
    @JSONSchema({
        description: 'The name of category',
        example: 'Dry Food'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => CategoryMetadata)
    metadata: CategoryMetadata;

    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    created_at: string;

    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updated_at: string;
}
