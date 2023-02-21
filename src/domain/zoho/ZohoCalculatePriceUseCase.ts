import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { RfqPricingSectionItems, ZohoCreateRFQDto } from './ZohoDto';
import { MicrosoftOfficeClientService } from '../services/MicrosoftOfficeClientService';
import { HttpError } from 'routing-controllers';
import { CalculatorParams, CalculatorResultResponse } from '../calculator/CalculatorEntity';

export enum MsOfficeCalculator {
    DOCUMENT_NAME = 'Pricing calculator - for Tipa Pro.xlsx',
    TIPA_PRO_DATA_SHEET = 'Tipa Pro data',
    TIPA_PRO_INTERFACE_SHEET = 'Tipa Pro Interface',
    FAST_TRACK_SHEET = 'Fast track',
    CELLS_TO_UPDATE = 'C3:C23',
    RESULT_EUR_CELL = 'H2',
    MOQ_UNIT_CELL = 'H3',
    MOQ_METER_CELL = 'H4',
    MOQ_KG_CELL = 'H5',
    MOQ_IMPRESSION_CELL = 'H6',
    RESULT_USD_CELL = 'H7',
    TOTAL_EUR_PRICE = 'H8',
    TOTAL_USD_PRICE = 'H9',
    RESULT_CELLS = 'H2:H13',
    FAST_TRACK_CELLS_TO_UPDATE = 'Z2:Z3',
    FAST_TRACK_RESULT_CELLS = 'AA10:AD14',
    FAST_TRACK_CODE_CELL = 'AA2'
}

export enum RfqAdditionalFeaturesNames {
    FLAP = 'flap',
    CLOSER = 'Closer',
    BASE = 'sealing',
    GUSSET = 'Gusset',
    HANGING = 'Hanging',
    NOTCH = 'Notch',
    PERFORATION = 'Perforation'
}

export enum RfqAdditionalFeatureHintNames {
    NUMBER_OF_HOLES = 'Number of holes',
}

export enum RfqCurrency {
    EUR = 'EUR',
    USD = 'USD'
}

export enum RfqShippingTerms {
    EXW = 'EXW',
    DAP = 'DAP'
}

export enum RfqPricingMeasureUnitNames {
    UNITS = 'Units',
    IMP = 'Imp',
    KG = 'Kg',
    METER = 'Meter'
}

export type MOQ = number | string;
export type PricingResult = number | string;

export enum ApplicationTypeDefaultNames {
    CONVERTING = 'converting'
}

@injectable()
export class ZohoCalculatePriceUseCase implements IUseCase<ZohoCreateRFQDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(MicrosoftOfficeClientService) private microsoftOfficeClientService: MicrosoftOfficeClientService
    ) { }

    public async execute(dto: ZohoCreateRFQDto, calculate_moq: boolean): Promise<ZohoCreateRFQDto> {
        try {

            const calculatedItems: RfqPricingSectionItems[] = [];
            let gusset_type: string = '';
            let hanging: string = '';
            let notch: string = '';
            let perforation: number | string = 'None';
            let closer: string = '';

            dto.additional_features_section?.forEach(feature => {

                if (feature.additional_feature_parent?.includes(RfqAdditionalFeaturesNames.GUSSET)) {
                    gusset_type = feature.additional_feature;
                    return;
                }
                if (feature.additional_feature_parent?.includes(RfqAdditionalFeaturesNames.HANGING)) {
                    hanging = 'V';
                    return;
                }
                if (feature.additional_feature_parent?.includes(RfqAdditionalFeaturesNames.NOTCH)) {
                    notch = 'V';
                    return;
                }
                if (feature.additional_feature_parent?.includes(RfqAdditionalFeaturesNames.PERFORATION)) {
                    perforation = feature?.additional_feature_hints.find(hint => hint.hint_name?.includes(RfqAdditionalFeatureHintNames.NUMBER_OF_HOLES))?.hint_value || 'None';
                    return;
                }
                if (feature.additional_feature_parent?.includes(RfqAdditionalFeaturesNames.CLOSER)) {
                    closer = feature.additional_feature;
                    return;
                }
            });

            const documents = await this.microsoftOfficeClientService.getDocuments();

            if (!documents) {
                throw new HttpError(404, 'Documents not found!');
            }

            const document = documents.value?.find(document => document.name === MsOfficeCalculator.DOCUMENT_NAME);

            const sheets = await this.microsoftOfficeClientService.getSheets({ document_id: document.id });

            if (!sheets) {
                throw new HttpError(404, 'Sheets not found!');
            }
            const tipaProDataSheet = sheets.value?.find(sheet => sheet.name === MsOfficeCalculator.TIPA_PRO_DATA_SHEET);
            const tipaProInterfaceSheet = sheets.value?.find(sheet => sheet.name === MsOfficeCalculator.TIPA_PRO_INTERFACE_SHEET);

            if (!tipaProDataSheet || !tipaProInterfaceSheet) {
                throw new HttpError(404, 'The required sheets were not found!')
            }

            for await (let item of dto.pricing_section?.items) {

                await this.microsoftOfficeClientService
                    .updateCells({
                        document_id: document.id,
                        sheet_id: tipaProInterfaceSheet.id,
                        cells: MsOfficeCalculator.CELLS_TO_UPDATE
                    }, {
                        values: [
                            /** C3 */ dto.product_section.product?.title || '',
                            /** C4 */ dto.product_section.film_grade || '',
                            /** C5 */ dto.application_section.application?.title || '',
                            /** C6 */ dto.application_section.application_type.title === ApplicationTypeDefaultNames.CONVERTING ? dto.application_section.estimated_application_type?.title : dto.application_section.application_type?.title,
                            /** C7 */ dto.product_section.thickness || '',
                            /** C8 */ dto.dimensions_section.height || '',
                            /** C9 */ dto.dimensions_section.width || '',
                            /** C10 */ dto.dimensions_section.flap || '',
                            /** C11 */ gusset_type,
                            /** C12 */ dto.dimensions_section.closed_gusset || '',
                            /** C13 */ dto.dimensions_section.box_weight_limitation || '',
                            /** C14 */ dto.dimensions_section.reel_weight_limitation || '',
                            /** C15 */ dto.graphics_section.number_of_colors || '',
                            /** C16 */ dto.pricing_section.pricing_measure_unit || '',
                            /** C17 */ item.quantity || '',
                            /** C18 */ hanging,
                            /** C19 */ notch,
                            /** C20 */ perforation,
                            /** C21 */ closer,
                            /** C22 */ dto.segment_section.segment?.title || '',
                            /** C23 */ dto.segment_section.segment_type?.title || ''
                        ]
                    });

                await this.microsoftOfficeClientService
                    .getCell({
                        document_id: document.id,
                        sheet_id: tipaProInterfaceSheet.id,
                        cells: MsOfficeCalculator.RESULT_USD_CELL
                    });

                if (calculate_moq && dto.pricing_section?.items.length) {
                    continue;
                }

                const resultsFromCalculator = await this.getResults({
                    document_id: document.id,
                    sheet_id: tipaProInterfaceSheet.id
                })

                //resultsFromCalculator is array with arrays
                //resultsFromCalculator[0][0] = *H2* EUR PRICE in excel
                //resultsFromCalculator[1][0] = *H3* MOQ Unit in excel
                //resultsFromCalculator[2][0] = *H4* MOQ Meter in excel
                //resultsFromCalculator[3][0] = *H5* MOQ KG in excel
                //resultsFromCalculator[4][0] = *H6* MOQ Impression in excel
                //resultsFromCalculator[5][0] = *H7* USD PRICE in excel
                //resultsFromCalculator[6][0] = *H8* Total EUR Price in excel
                //resultsFromCalculator[7][0] = *H9* Total USD Price in excel
                //resultsFromCalculator[8][0] = *H10* Eur Cost in excel
                //resultsFromCalculator[9][0] = *H11* USD Cost in excel
                //resultsFromCalculator[10][0] = *H12* Convertor Cost Eur in excel
                //resultsFromCalculator[11][0] = *H13* Convertor cost USD in excel

                let price = await this.getPriceByCurrency(dto.pricing_section.currency, resultsFromCalculator);

                let totalPrice = await this.getTotalPriceByCurrency(dto.pricing_section.currency, resultsFromCalculator);

                calculatedItems.push({
                    quantity: item.quantity,
                    price_total: totalPrice,
                    price_per_unit: price,
                    eur_price: typeof resultsFromCalculator[0][0] === 'string' ? null : resultsFromCalculator[0][0], /** H2 EUR PRICE in excel */
                    moq_unit: typeof resultsFromCalculator[1][0] === 'string' ? null : resultsFromCalculator[1][0], /** H3 MOQ Unit in excel */
                    moq_meter: typeof resultsFromCalculator[2][0] === 'string' ? null : resultsFromCalculator[2][0], /** H4 MOQ Meter in excel */
                    moq_kg: typeof resultsFromCalculator[3][0] === 'string' ? null : resultsFromCalculator[3][0], /** H5 MOQ KG in excel */
                    moq_impression: typeof resultsFromCalculator[4][0] === 'string' ? null : resultsFromCalculator[4][0], /** H6 MOQ Impression in excel */
                    usd_price: typeof resultsFromCalculator[5][0] === 'string' ? null : resultsFromCalculator[5][0], /** H7 USD PRICE in excel */
                    total_eur_price: typeof resultsFromCalculator[6][0] === 'string' ? null : resultsFromCalculator[6][0], /** H8 Total EUR Price in excel */
                    total_usd_price: typeof resultsFromCalculator[7][0] === 'string' ? null : resultsFromCalculator[7][0], /** H9 Total USD Price in excel */
                    eur_cost: typeof resultsFromCalculator[8][0] === 'string' ? null : resultsFromCalculator[8][0], /** H10 Eur Cost in excel */
                    usd_cost: typeof resultsFromCalculator[9][0] === 'string' ? null : resultsFromCalculator[9][0], /** H11 USD Cost in excel */
                    convertor_cost_eur: typeof resultsFromCalculator[10][0] === 'string' ? null : resultsFromCalculator[10][0], /** H12 Convertor Cost Eur in excel */
                    convertor_cost_usd: typeof resultsFromCalculator[11][0] === 'string' ? null : resultsFromCalculator[11][0], /** H13 Convertor cost USD in excel */
                });
            }

            let moq = await this.getMOQ(dto.pricing_section.pricing_measure_unit, {
                document_id: document.id,
                sheet_id: tipaProInterfaceSheet.id
            });

            if (typeof moq === 'string') {
                moq = null;
            }

            dto.pricing_section.items = calculatedItems;
            dto.pricing_section.moq = moq;

            return dto;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    private async getMOQ(pricing_measure_unit: string, { document_id, sheet_id }: CalculatorParams): Promise<MOQ> {

        switch (pricing_measure_unit) {
            case RfqPricingMeasureUnitNames.UNITS:
                const { values: [moq_unit] } = await this.microsoftOfficeClientService
                    .getCell({
                        document_id,
                        sheet_id,
                        cells: MsOfficeCalculator.MOQ_UNIT_CELL
                    });

                return moq_unit[0];
            case RfqPricingMeasureUnitNames.METER:
                const { values: [moq_meter] } = await this.microsoftOfficeClientService
                    .getCell({
                        document_id,
                        sheet_id,
                        cells: MsOfficeCalculator.MOQ_METER_CELL
                    });

                return moq_meter[0];
            case RfqPricingMeasureUnitNames.KG:
                const { values: [moq_kg] } = await this.microsoftOfficeClientService
                    .getCell({
                        document_id,
                        sheet_id,
                        cells: MsOfficeCalculator.MOQ_KG_CELL
                    });

                return moq_kg[0];
            case RfqPricingMeasureUnitNames.IMP:
                const { values: [moq_imp] } = await this.microsoftOfficeClientService
                    .getCell({
                        document_id,
                        sheet_id,
                        cells: MsOfficeCalculator.MOQ_IMPRESSION_CELL
                    });

                return moq_imp[0];
            default:
                return null;
        }
    }

    private async getPriceByCurrency(currency: string, calculatorResult: CalculatorResultResponse): Promise<PricingResult> {

        switch (currency) {
            case RfqCurrency.USD:
                let usd_price = calculatorResult[5][0];   //*H7* USD PRICE in excel

                if (typeof usd_price === 'string') {
                    return null;
                }
                return usd_price;

            case RfqCurrency.EUR:
                let eur_price = calculatorResult[0][0];   //*H2* EUR PRICE in excel

                if (typeof eur_price === 'string') {
                    return null;
                }

                return eur_price;

            default:
                return null;
        }
    }

    private async getTotalPriceByCurrency(currency: string, calculatorResult: CalculatorResultResponse): Promise<PricingResult> {

        switch (currency) {
            case RfqCurrency.USD:
                let total_usd_price = calculatorResult[7][0];   //*H9* Total USD Price in excel

                if (typeof total_usd_price === 'string') {
                    total_usd_price = null;
                }

                return total_usd_price;

            case RfqCurrency.EUR:
                let total_eur_price = calculatorResult[6][0];   //*H8* Total EUR Price in excel

                if (typeof total_eur_price === 'string') {
                    total_eur_price = null;
                }

                return total_eur_price;
            default:
                return null;
        }
    }

    private async getResults({ document_id, sheet_id }: CalculatorParams): Promise<CalculatorResultResponse> {

        const { values } = await this.microsoftOfficeClientService
            .getCells({
                document_id,
                sheet_id,
                cells: MsOfficeCalculator.RESULT_CELLS
            });

        return values;

    }
}