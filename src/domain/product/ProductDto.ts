import {
    IsOptional,
    IsString,
    IsDateString,
    IsNumber,
    ValidateNested,
    Max,
    Min,
    IsObject,
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    MaxLength,
    ArrayNotEmpty
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {Type} from 'class-transformer';
import {AdditionalFeatures, Certificate, Size, TechnicalConsiderations} from '../application/ApplicationDto';
import {DisplayPriority, LevelOfClearance, ManufacturingTechnique, Stage} from './ProductEntity';

export class Tds {

    @IsString()
    @IsOptional()
    url: string;
}

export class Msds {

    @IsString()
    @IsOptional()
    url: string;
}

export class Collaterals {

    @IsString()
    @IsOptional()
    url: string;
}

export class Certification {

    @IsString()
    @IsOptional()
    file_url: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsOptional()
    category_id: number;

    @IsBoolean()
    @IsOptional()
    download: boolean;

}

export class Thickness {

    @IsArray()
    @IsNumber({}, {each: true})
    values: number[];

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

}

export class PrintingMethod {

    @IsArray()
    values: string[];

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

}

export class AvailableTerritories {

    @IsArray()
    values: string[];

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

}

export class Printability {

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Description (Printability) field is too long',
    })
    description: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Url (Printability) field is too long',
    })
    url: string;
}

export class Barrier {

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Description (Barrier) field is too long',
    })
    description: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Url (Barrier) field is too long',
    })
    url: string;
}

export class ProductCreateDto {

    @IsString()
    @JSONSchema({
        example: 'Tipa 302'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

    @IsString()
    @MaxLength(2000, {
        message: 'Description field is too long',
    })
    description: string;

    @IsOptional()
    @IsString({each: true})
    @IsArray()
    @ArrayMaxSize(10)
    images: string[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    family: number[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    segment: number[];

    @IsOptional()
    @IsNumber({}, {each: true})
    segment_type: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Size)
    width: Size[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Tds)
    tds: Tds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Msds)
    msds: Msds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Collaterals)
    collaterals: Collaterals[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certification)
    certifications: Certification[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        enum: [
            ManufacturingTechnique.CAST,
            ManufacturingTechnique.BLOWN
        ],
        description: `\n
        1 - Cast\n
        2 - Blown`,
        example: 1
    })
    manufacturing_technique: ManufacturingTechnique;

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    @JSONSchema({
        description: `Application with categories from Reel (Reel-Laminate, Reel-Film)`,
        example: [1]
    })
    application: number[];

    @IsNumber()
    @JSONSchema({
        enum: [
            DisplayPriority.PRIORITY1,
            DisplayPriority.PRIORITY2,
            DisplayPriority.PRIORITY3,
            DisplayPriority.PRIORITY4,
            DisplayPriority.PRIORITY5,
            DisplayPriority.PRIORITY6,
            DisplayPriority.PRIORITY7,
            DisplayPriority.PRIORITY8,
            DisplayPriority.PRIORITY9,
            DisplayPriority.PRIORITY10
        ],
        description: `\n
        1 - Top level priority\n
        5 - Default level priority\n
        10 - Low level priority`,
        example: 1
    })
    display_priority: DisplayPriority;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Barrier)
    barrier: Barrier;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Printability)
    printability: Printability;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsNumber()
    @IsOptional()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    printing_stage: Stage;

    @IsNumber({}, {each: true})
    @IsOptional()
    packed_goods: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsNumber()
    @Max(3)
    @Min(1)
    @IsOptional()
    @JSONSchema({
        enum: [
            LevelOfClearance.ADMIN_LEVEL_ONLY,
            LevelOfClearance.PUBLIC_TO_ALL,
            LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR
        ],
        description: `\n
        3 - Admin level only\n
        1 - Public to all,
        2 - Visible in Pro, only Admin in generator`,
        example: 1
    })
    level_of_clearance: LevelOfClearance;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certificate)
    certificates: Certificate[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PrintingMethod)
    printing_method: PrintingMethod[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AvailableTerritories)
    available_territories: AvailableTerritories[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => MoqMethod)
    moq: MoqMethod[];

    @IsOptional()
    @IsNumber({}, {each: true})
    partner_name: number[];

    @IsOptional()
    @IsString()
    production_site: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    notes_area: string;
}

export interface IProductImage {
    id: string;
    url: string;
}

export class ProductUpdateDto {

    @IsString()
    @JSONSchema({
        example: 'Tipa 302'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

    @IsString()
    @MaxLength(2000, {
        message: 'Description field is too long',
    })
    description: string;

    @IsOptional()
    @IsString({each: true})
    @IsArray()
    @ArrayMaxSize(10)
    images: string[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    family: number[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    segment: number[];

    @IsOptional()
    @IsNumber({}, {each: true})
    segment_type: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Size)
    width: Size[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Tds)
    tds: Tds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Msds)
    msds: Msds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Collaterals)
    collaterals: Collaterals[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certification)
    certifications: Certification[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        enum: [
            ManufacturingTechnique.CAST,
            ManufacturingTechnique.BLOWN
        ],
        description: `\n
        1 - Cast\n
        2 - Blown`,
        example: 1
    })
    manufacturing_technique: ManufacturingTechnique;

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    @JSONSchema({
        description: `Application with categories from Reel (Reel-Laminate, Reel-Film)`,
        example: [1]
    })
    application: number[];

    @IsNumber()
    @JSONSchema({
        enum: [
            DisplayPriority.PRIORITY1,
            DisplayPriority.PRIORITY2,
            DisplayPriority.PRIORITY3,
            DisplayPriority.PRIORITY4,
            DisplayPriority.PRIORITY5,
            DisplayPriority.PRIORITY6,
            DisplayPriority.PRIORITY7,
            DisplayPriority.PRIORITY8,
            DisplayPriority.PRIORITY9,
            DisplayPriority.PRIORITY10
        ],
        description: `\n
        1 - Top level priority\n
        5 - Default level priority\n
        10 - Low level priority`,
        example: 1
    })
    display_priority: DisplayPriority;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Barrier)
    barrier: Barrier;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Printability)
    printability: Printability;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsNumber()
    @IsOptional()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    printing_stage: Stage;

    @IsNumber({}, {each: true})
    @IsOptional()
    packed_goods: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsNumber()
    @Max(3)
    @Min(1)
    @IsOptional()
    @JSONSchema({
        enum: [
            LevelOfClearance.ADMIN_LEVEL_ONLY,
            LevelOfClearance.PUBLIC_TO_ALL,
            LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR
        ],
        description: `\n
        3 - Admin level only\n
        1 - Public to all,
        2 - Visible in Pro, only Admin in generator`,
        example: 1
    })
    level_of_clearance: LevelOfClearance;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certificate)
    certificates: Certificate[];
}

export class ProductDto {

    @IsNumber()
    id: number;

    @IsString()
    @JSONSchema({
        example: 'Tipa 302'
    })
    @MaxLength(250, {
        message: 'Title field is too long',
    })
    title: string;

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: Stage;

    @IsString()
    @MaxLength(2000, {
        message: 'Description field is too long',
    })
    description: string;

    @IsOptional()
    @IsString({each: true})
    @IsArray()
    @ArrayMaxSize(10)
    images: IProductImage[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    family: number[];

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    segment: number[];

    @IsOptional()
    @IsNumber({}, {each: true})
    segment_type: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => SizeProduct)
    width: SizeProduct[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Tds)
    tds: Tds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Msds)
    msds: Msds[];

    @IsArray()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => Collaterals)
    collaterals: Collaterals[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certification)
    certifications: Certification[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        enum: [
            ManufacturingTechnique.CAST,
            ManufacturingTechnique.BLOWN
        ],
        description: `\n
        1 - Cast\n
        2 - Blown`,
        example: 1
    })
    manufacturing_technique: ManufacturingTechnique;

    @IsNumber({}, {each: true})
    @ArrayNotEmpty()
    @JSONSchema({
        description: `Application with categories from Reel (Reel-Laminate, Reel-Film)`,
        example: [1]
    })
    application: number[];

    @IsNumber()
    @JSONSchema({
        enum: [
            DisplayPriority.PRIORITY1,
            DisplayPriority.PRIORITY2,
            DisplayPriority.PRIORITY3,
            DisplayPriority.PRIORITY4,
            DisplayPriority.PRIORITY5,
            DisplayPriority.PRIORITY6,
            DisplayPriority.PRIORITY7,
            DisplayPriority.PRIORITY8,
            DisplayPriority.PRIORITY9,
            DisplayPriority.PRIORITY10
        ],
        description: `\n
        1 - Top level priority\n
        5 - Default level priority\n
        10 - Low level priority`,
        example: 1
    })
    display_priority: DisplayPriority;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Barrier)
    barrier: Barrier;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Printability)
    printability: Printability;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsNumber()
    @IsOptional()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    printing_stage: Stage;

    @IsNumber({}, {each: true})
    @IsOptional()
    packed_goods: number[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsNumber()
    @Max(3)
    @Min(1)
    @IsOptional()
    @JSONSchema({
        enum: [
            LevelOfClearance.ADMIN_LEVEL_ONLY,
            LevelOfClearance.PUBLIC_TO_ALL,
            LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR
        ],
        description: `\n
        3 - Admin level only\n
        1 - Public to all,
        2 - Visible in Pro, only Admin in generator`,
        example: 1
    })
    level_of_clearance: LevelOfClearance;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Certificate)
    certificates: Certificate[];

    @IsDateString()
    @JSONSchema({format: 'date-time'})
    created_at: string;

    @IsDateString()
    @JSONSchema({format: 'date-time'})
    updated_at: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PrintingMethod)
    printing_method: PrintingMethod[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AvailableTerritories)
    available_territories: AvailableTerritories[];

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => MoqMethod)
    moq: MoqMethod[];

    @IsOptional()
    @IsNumber({}, {each: true})
    partner_name: number[];

    @IsOptional()
    @IsString()
    production_site: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    notes_area: string;
}

export class SizeProduct {
    @IsNumber()
    @Min(0)
    min: number;

    @IsNumber()
    @Min(0)
    max: number

    @IsNumber()
    @IsNumber({}, {each: true})
    measure_unit: number[]

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: number;

}

export class MoqMethod {

    @IsNumber()
    moq: number;

    @IsOptional()
    @IsNumber({}, {each: true})
    measure_unit: number[];

    @IsOptional()
    @IsString()
    notes: string;

    @IsNumber()
    @Max(4)
    @Min(1)
    @JSONSchema({
        enum: [
            Stage.COMMERCIAL,
            Stage.UNDER_DEVELOPMENT,
            Stage.FUTURE_DEVELOPMENT,
            Stage.PARTNERS
        ],
        description: `\n
        1 - Commercial\n
        2 - Under development\n
        3 - Feature development
        4 - Partners`,
        example: 2
    })
    stage: number;

}
