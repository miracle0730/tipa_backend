import { IsOptional, IsString, IsDateString, IsNumber, ValidateNested, IsObject, IsBoolean, IsArray, ArrayMaxSize, ArrayNotEmpty, MaxLength, Min, Max } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Type } from 'class-transformer';
import { ICustomerImages } from './ExpandCustomerUseCase';
import { DisplayPriority, LevelOfClearance, Stage } from '../product/ProductEntity';
import {Certification, PrintingMethod, Thickness} from '../product/ProductDto';
import { IAvailableMarketingSampleImages } from './ExpandAvailableMarketingSamplesUseCase';

export class Dieline {

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Dieline url field is too long',
    })
    url: string;
}

export class Certificate {
    @IsNumber()
    @IsOptional()
    certificate_id: number;

    @IsBoolean()
    @IsOptional()
    download_graphics: boolean;

    @IsString()
    @IsOptional()
    notes: string;

    @IsArray()
    @IsOptional()
    @JSONSchema({
        description: 'Values must be numbers like [15,40,55] or strings like ["All thickness"]'
    })
    thickness: (number | string)[];
}

export class Size {
    @IsNumber()
    @Min(0)
    min: number;

    @IsNumber()
    @Min(0)
    max: number

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

export class AdditionalFeatures {

    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    @JSONSchema({
        description: 'array of Additional features ids',
        example: [1, 2]
    })
    ids: number[];

    @IsOptional()
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

    @IsBoolean()
    @IsOptional()
    mandatory: boolean;

}

export class TechnicalConsiderations {

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Description (Technical considerations) field is too long',
    })
    description: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Url (Technical considerations) field is too long',
    })
    url: string;
}

export class Customer {

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(10)
    images: ICustomerImages[];

    @IsString()
    @IsOptional()
    description: string;
}

export class AvailableMarketingSamples {
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(10)
    images: IAvailableMarketingSampleImages[];

    @IsString()
    @IsOptional()
    description: string;
}

export class Stream {

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Stream type field is too long',
    })
    @JSONSchema({
        enum: [
            'Fast Track',
            'Stock',
            'Custom'
        ],
        example: 'Fast Track'
    })
    type: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Stream title field is too long',
    })
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Stream file url field is too long',
    })
    file_url: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Stream site url field is too long',
    })
    site_url: string;

    @IsBoolean()
    @IsOptional()
    checked: boolean;
}

export class FTDimensions {
    @IsNumber()
    @IsOptional()
    size?: number;

    @IsNumber()
    @IsOptional()
    width: number;

    @IsNumber()
    @IsOptional()
    height: number;

    @IsNumber()
    @IsOptional()
    flap: number;

    @IsNumber()
    @IsOptional()
    gusset: number;

    @IsString()
    @IsOptional()
    dieline_url: string;

}

export class FTItems {

    @IsBoolean()
    @IsOptional()
    visible: boolean;

    @IsString()
    @IsOptional()
    code: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => FTDimensions)
    dimension: FTDimensions;

    @IsNumber()
    @IsOptional()
    thickness: number;

    @IsNumber()
    @IsOptional()
    color: number;

    @IsNumber()
    @IsOptional()
    moq: number;
}

export class FastTrack {

    @IsOptional()
    @IsString()
    application_number: string;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Production site field is too long',
    })
    production_site: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    @IsArray()
    number_of_printing_colors: number[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FTDimensions)
    dimensions: FTDimensions[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FTItems)
    items: FTItems[];
}

export class ApplicationCreateDto {

    @IsNumber()
    @JSONSchema({
        description: `type = id from categories`,
        example: 1
    })
    type: number;

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
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(10)
    images: string[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    application: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment_type: number[];

    @IsNumber({}, { each: true })
    @IsOptional()
    packed_goods: number[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    product: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    width: Size[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    height: Size[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Production process field is too long',
    })
    production_process: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Tipa production site field is too long',
    })
    tipa_production_site: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Positive experiments field is too long',
    })
    positive_experiments: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Negative feedback to be aware of, field is too long',
    })
    negative_feedback_to_be_aware_of: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Dieline)
    dieline: Dieline;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Customer)
    customers: Customer[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailableMarketingSamples)
    available_marketing_samples: AvailableMarketingSamples[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

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

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Certification)
    certifications: Certification[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Stream)
    streams: Stream[];

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => FastTrack)
    fast_track: FastTrack;

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
    @ValidateNested({ each: true })
    @Type(() => Certificate)
    certificates: Certificate[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PrintingMethod)
    printing_method: PrintingMethod[];

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

export interface IApplicationImage {
    id: string;
    url: string;
}

export class ApplicationUpdateDto {
    @IsNumber()
    @JSONSchema({
        description: `type = id from categories`,
        example: 1
    })
    type: number;

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
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(10)
    images: string[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    application: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment_type: number[];

    @IsNumber({}, { each: true })
    @IsOptional()
    packed_goods: number[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    product: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    width: Size[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    height: Size[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Production process field is too long',
    })
    production_process: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Tipa production site field is too long',
    })
    tipa_production_site: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Positive experiments field is too long',
    })
    positive_experiments: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Negative feedback to be aware of, field is too long',
    })
    negative_feedback_to_be_aware_of: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Dieline)
    dieline: Dieline;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Customer)
    customers: Customer[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailableMarketingSamples)
    available_marketing_samples: AvailableMarketingSamples[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

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

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Certification)
    certifications: Certification[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Stream)
    streams: Stream[];

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => FastTrack)
    fast_track: FastTrack;

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
    @ValidateNested({ each: true })
    @Type(() => Certificate)
    certificates: Certificate[];
}

export class ApplicationDto {
    @IsNumber()
    id: number;

    @IsNumber()
    @JSONSchema({
        description: `type = id from categories`,
        example: 1
    })
    type: number;

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
    @IsString({ each: true })
    @IsArray()
    @ArrayMaxSize(10)
    images: IApplicationImage[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    application: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    segment_type: number[];

    @IsNumber({}, { each: true })
    @IsOptional()
    packed_goods: number[];

    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    product: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Thickness)
    thickness: Thickness[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    width: Size[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Size)
    height: Size[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Production process field is too long',
    })
    production_process: string;

    @IsString()
    @IsOptional()
    @MaxLength(250, {
        message: 'Tipa production site field is too long',
    })
    tipa_production_site: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => TechnicalConsiderations)
    technical_considerations: TechnicalConsiderations;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Features field is too long',
    })
    features: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Positive experiments field is too long',
    })
    positive_experiments: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Negative feedback to be aware of, field is too long',
    })
    negative_feedback_to_be_aware_of: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => Dieline)
    dieline: Dieline;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Customer)
    customers: Customer[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailableMarketingSamples)
    available_marketing_samples: AvailableMarketingSamples[];

    @IsBoolean()
    @IsOptional()
    draft: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AdditionalFeatures)
    additional_features: AdditionalFeatures[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'Terms and limitations field is too long',
    })
    terms_and_limitations: string;

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

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Certification)
    certifications: Certification[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Stream)
    streams: Stream[];

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => FastTrack)
    fast_track: FastTrack;

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
    @ValidateNested({ each: true })
    @Type(() => Certificate)
    certificates: Certificate[];

    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    created_at: string;

    @IsDateString()
    @JSONSchema({ format: 'date-time' })
    updated_at: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PrintingMethod)
    printing_method: PrintingMethod[];

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

export class MessageResponseDto {

    @IsString()
    message: string;
}

export class ApplicationNumberAvailabilityDto {

    @IsOptional()
    @IsString()
    @JSONSchema({
        description: `\n
        only two-digit numbers \n
        from 01 to 99
        `,
        example: '01'
    })
    application_number: string;

    @IsNumber()
    @IsOptional()
    application_id: number;

}