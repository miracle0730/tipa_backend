import { JSONSchema } from 'class-validator-jsonschema';
import {
    IsNumber,
    IsOptional,
    IsString,
    IsDateString,
    IsEmail,
    IsObject,
    ValidateNested,
    IsNotEmpty, MinLength, MaxLength, ArrayNotEmpty, IsArray, IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { RfqCurrency, RfqPricingMeasureUnitNames, RfqShippingTerms } from './ZohoCalculatePriceUseCase';

export class RfqExtendedField {

    @IsOptional()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    title: string;

}
export class RfqSegmentSection {

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    segment: RfqExtendedField;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    segment_type: RfqExtendedField;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    packed_goods: RfqExtendedField;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    expected_shelf_life: string;

}

export class RfqApplicationSection {

    @IsObject()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    packaging: RfqExtendedField;

    @IsObject()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    application: RfqExtendedField;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    application_type: RfqExtendedField;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    estimated_application_type: RfqExtendedField;

}

export class RfqAdditionalFeatureHint {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    hint_name: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    hint_value: string;

}

export class RfqProductSection {

    @IsObject()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    product_family: RfqExtendedField;

    @IsObject()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    product: RfqExtendedField;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    film_grade: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    manufacturing_technique: string;

    @IsNumber()
    thickness: number;

}

export class RfqAdditionalFeaturesSection {

    @IsNumber()
    id: number;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    additional_feature: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    additional_feature_parent: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqAdditionalFeatureHint)
    additional_feature_hints: RfqAdditionalFeatureHint[];

}

export class RfqDimensionsSection {
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
    closed_gusset: number;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqExtendedField)
    core: RfqExtendedField;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    reel_length_limitation: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    box_weight_limitation: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    od: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    reel_weight_limitation: string;

    @IsNumber()
    @IsOptional()
    cof: number;
}

export class RfqGraphicsSection {

    @IsBoolean()
    @IsOptional()
    printing: boolean;

    @IsNumber()
    @IsOptional()
    number_of_colors: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqGraphicsSectionExternalLogo)
    external_logo: RfqGraphicsSectionExternalLogo[];

    @IsString()
    @IsOptional()
    @MaxLength(2000, {
        message: 'RTF field is too long',
    })
    rtf: string;

    @IsBoolean()
    @IsOptional()
    digital_printing: boolean;

}

export class RfqGraphicsSectionExternalLogo {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    certificate_name: string;

    @IsNumber()
    @IsOptional()
    id: number;

}

export class RfqPricingSection {

    @IsString()
    @MaxLength(250)
    @JSONSchema({
        enum: [
            RfqPricingMeasureUnitNames.UNITS,
            RfqPricingMeasureUnitNames.METER,
            RfqPricingMeasureUnitNames.KG,
            RfqPricingMeasureUnitNames.IMP
        ],
        description: `\n
        'Units'\n
        'Meter'\n
        'Kg'\n
        'Imp'\n`,
        example: 'Units'
    })
    @IsOptional()
    pricing_measure_unit: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    annual_quantity_potential: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    current_material_used: string;

    @IsNumber()
    @IsOptional()
    current_price_payed: number;

    @IsString()
    @MaxLength(2000)
    @IsOptional()
    remarks: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqPricingSectionItems)
    items: RfqPricingSectionItems[];

    @IsOptional()
    moq: number | string;

    @JSONSchema({
        enum: [
            RfqCurrency.USD,
            RfqCurrency.EUR
        ],
        description: `\n
        'USD'\n
        'EUR'\n`,
        example: 'USD'
    })
    @IsOptional()
    @IsString()
    currency: string;

    @IsOptional()
    @IsNumber()
    imp_width: number;

    @IsOptional()
    @IsNumber()
    imp_height: number;

    @IsOptional()
    @IsString()
    fast_track_code: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ZohoFastTrackPriceListDto)
    price_list: ZohoFastTrackPriceListDto[];

    @JSONSchema({
        enum: [
            RfqShippingTerms.EXW,
            RfqShippingTerms.DAP
        ],
        description: `\n
        'EXW'\n
        'DAP'\n`,
        example: 'EXW'
    })
    @IsOptional()
    @IsString()
    shipping_terms: string;

}

export class RfqPricingSectionItems {

    @IsOptional()
    quantity: number | string;

    @IsOptional()
    price_total: number | string;

    @IsOptional()
    price_per_unit: number | string;

    @IsOptional()
    eur_price: number | string;

    @IsOptional()
    moq_unit: number | string;

    @IsOptional()
    moq_meter: number | string;

    @IsOptional()
    moq_kg: number | string;

    @IsOptional()
    moq_impression: number | string;

    @IsOptional()
    usd_price: number | string;

    @IsOptional()
    total_eur_price: number | string;

    @IsOptional()
    total_usd_price: number | string;

    @IsOptional()
    eur_cost: number | string;

    @IsOptional()
    usd_cost: number | string;

    @IsOptional()
    convertor_cost_eur: number | string;

    @IsOptional()
    convertor_cost_usd: number | string;

}

export class RfqFeedbackSectionPackedGoods {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    title: string;

    @IsBoolean()
    @IsOptional()
    checked: boolean;

}

export class RfqFeedbackSectionProduction {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    title: string;

    @IsBoolean()
    @IsOptional()
    checked: boolean;

}

export class RfqFeedbackSectionPricing {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    title: string;

    @IsBoolean()
    @IsOptional()
    checked: boolean;

}

export class RfqFeedbackSection {

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqFeedbackSectionPackedGoods)
    packed_goods: RfqFeedbackSectionPackedGoods[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqFeedbackSectionProduction)
    production: RfqFeedbackSectionProduction[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqFeedbackSectionPricing)
    pricing: RfqFeedbackSectionPricing[];

}

export class ZohoOpportunityDto {
    @IsOptional()
    @IsString()
    @MaxLength(250)
    id: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    accountName: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    owner: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    user_id: string;

}

export class RfqSection {

    @IsString()
    @MaxLength(250)
    @IsOptional()
    id: string;

    @IsString()
    @MaxLength(250)
    @IsOptional()
    action: string;

}

export class RfqOtherSection {

    @IsOptional()
    @IsString()
    rfq_is_for: string;

}

export class ZohoCreateRFQDto {

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => ZohoOpportunityDto)
    opportunity_section: ZohoOpportunityDto;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqSegmentSection)
    segment_section: RfqSegmentSection;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqApplicationSection)
    application_section: RfqApplicationSection;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqProductSection)
    product_section: RfqProductSection;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RfqAdditionalFeaturesSection)
    additional_features_section: RfqAdditionalFeaturesSection[];

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqDimensionsSection)
    dimensions_section: RfqDimensionsSection;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqGraphicsSection)
    graphics_section: RfqGraphicsSection;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqPricingSection)
    pricing_section: RfqPricingSection;

    @IsString()
    @IsOptional()
    @JSONSchema({
        example: 'New RFQ Item'
    })
    rfq_status: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqFeedbackSection)
    feedback_section: RfqFeedbackSection;

    @IsNumber()
    @IsOptional()
    @JSONSchema({
        description: `\n
        1 - Applications & Printed Reels\n
        2 - Unprinted films\n`,
        example: 1
    })
    form_mode: number;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqSection)
    rfq_section: RfqSection;

    @IsString()
    @IsOptional()
    @JSONSchema({
        description: `\n
        - fast_track\n
        - custom\n`,
        example: 'fast_track'
    })
    type: string;

    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => RfqOtherSection)
    other_section: RfqOtherSection;
}

export class ZohoSuccessResponse {
    @IsString()
    @JSONSchema({
        example: 'message'
    })
    message: string;
}

export class ZohoFastTrackPriceListDto {

    @IsOptional()
    @IsNumber()
    from_qty: number;

    @IsOptional()
    @IsNumber()
    to_qty: number;

    @IsOptional()
    @IsNumber()
    price_eur: number;

    @IsOptional()
    @IsNumber()
    price_usd: number;

}

