import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ZohoFastTrackPriceListDto } from './ZohoDto';
import { MicrosoftOfficeClientService } from '../services/MicrosoftOfficeClientService';
import { HttpError } from 'routing-controllers';
import { CalculatorParams, CalculatorResultResponse } from '../calculator/CalculatorEntity';
import { MsOfficeCalculator } from './ZohoCalculatePriceUseCase';
import { FTItems } from '../application/ApplicationDto';

@injectable()
export class ZohoCalculateFastTrackPriceListUseCase implements IUseCase<ZohoFastTrackPriceListDto[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(MicrosoftOfficeClientService) private microsoftOfficeClientService: MicrosoftOfficeClientService
    ) { }

    public async execute(dto: FTItems): Promise<ZohoFastTrackPriceListDto[]> {
        try {

            if (!dto || !dto.code || !dto.color) {
                throw new HttpError(400, 'Nothing to calculate!');
            }

            const documents = await this.microsoftOfficeClientService.getDocuments();

            if (!documents) {
                throw new HttpError(404, 'Documents not found!');
            }

            const document = documents.value?.find(document => document.name === MsOfficeCalculator.DOCUMENT_NAME);

            const sheets = await this.microsoftOfficeClientService.getSheets({ document_id: document.id });

            if (!sheets) {
                throw new HttpError(404, 'Sheets not found!');
            }
            const fastTrackSheet = sheets.value?.find(sheet => sheet.name === MsOfficeCalculator.FAST_TRACK_SHEET);

            if (!fastTrackSheet) {
                throw new HttpError(404, 'The required sheets were not found!')
            }

            await this.microsoftOfficeClientService
                .updateCells({
                    document_id: document.id,
                    sheet_id: fastTrackSheet.id,
                    cells: MsOfficeCalculator.FAST_TRACK_CELLS_TO_UPDATE
                }, {
                    values: [
                      /** Z2 */  dto.code,
                      /** Z3 */  dto.color
                    ]
                });

            await this.microsoftOfficeClientService
                .getCell({
                    document_id: document.id,
                    sheet_id: fastTrackSheet.id,
                    cells: MsOfficeCalculator.FAST_TRACK_CODE_CELL
                });

            // [[ from_qty, to_qty, price_eur, price_usd]]
            const resultsFromCalculator = await this.getResults({
                document_id: document.id,
                sheet_id: fastTrackSheet.id
            });

            const price_list: ZohoFastTrackPriceListDto[] = resultsFromCalculator
                .map((price_item_array: number[]) => {
                    return {
                        from_qty: typeof price_item_array[0] === 'string' ? null : price_item_array[0],
                        to_qty: typeof price_item_array[1] === 'string' ? null : price_item_array[1],
                        price_eur: typeof price_item_array[2] === 'string' ? null : price_item_array[2],
                        price_usd: typeof price_item_array[3] === 'string' ? null : price_item_array[3]
                    }
                });

            return price_list;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    private async getResults({ document_id, sheet_id }: CalculatorParams): Promise<CalculatorResultResponse> {

        const { values } = await this.microsoftOfficeClientService
            .getCells({
                document_id,
                sheet_id,
                cells: MsOfficeCalculator.FAST_TRACK_RESULT_CELLS
            });

        return values;

    }
}