import { inject, injectable } from 'inversify';
import axios, { AxiosResponse } from 'axios';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { config } from '../../infra/config'
import { RfqFeedbackSectionPackedGoods, RfqFeedbackSectionPricing, RfqFeedbackSectionProduction, ZohoCreateRFQDto, ZohoSuccessResponse } from './ZohoDto';
import { ZohoErrorCodes } from './ZohoClient';
import { HttpError } from 'routing-controllers';

export type ZohoRfqFeedbackSectionStatus =
    | RfqFeedbackSectionPackedGoods
    | RfqFeedbackSectionProduction
    | RfqFeedbackSectionPricing;

@injectable()
export class ZohoCreateRFQUseCase implements IUseCase<ZohoSuccessResponse> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger
    ) { }

    public async execute(dto: ZohoCreateRFQDto, can_be_priced: boolean): Promise<ZohoSuccessResponse> {

        try {
            dto.rfq_status = 'New RFQ Item';

            if (dto.feedback_section?.packed_goods?.length && dto.feedback_section?.pricing?.length && dto.feedback_section?.production?.length) {
                dto.feedback_section.packed_goods?.push(this.feedbackSectionStatus(!dto.feedback_section.packed_goods?.some(feedback => feedback.checked)));
                dto.feedback_section.pricing?.push(this.feedbackSectionStatus(!dto.feedback_section?.pricing.some(feedback => feedback.checked)));
                dto.feedback_section.production?.push(this.feedbackSectionStatus(!dto.feedback_section.production?.some(feedback => feedback.checked)));
            }

            this.logger.info(JSON.stringify(dto));

            const response = await this.createRfq(dto);

            if (response.data?.code === ZohoErrorCodes.INVALID_DATA_CODE) {
                throw new HttpError(400, 'Invalid data message from zoho');
            }

            if (can_be_priced) {
                if (response.data.code === 'success' || JSON.parse(response?.data?.details?.output)?.status === ZohoErrorCodes.OK_STATUS) {
                    return { message: 'priced RFQ was created.' };
                }
                if (JSON.parse(response?.data?.details?.output)?.status === ZohoErrorCodes.ERROR_STATUS) {
                    throw new HttpError(400, `error on Zoho CRM side, priced RFQ item isn't created`);
                }

                return { message: 'priced RFQ was not created.' };

            } else {
                if (response.data.code === 'success' || JSON.parse(response?.data?.details?.output)?.status === ZohoErrorCodes.OK_STATUS) {
                    return { message: 'manual RFQ was created.' };
                }
                if (JSON.parse(response?.data?.details?.output)?.status === ZohoErrorCodes.ERROR_STATUS) {
                    throw new HttpError(400, `error on Zoho CRM side, manual RFQ item isn't created`);
                }

                return { message: 'manual RFQ was not created.' };
            }
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    private async createRfq(dto: ZohoCreateRFQDto): Promise<AxiosResponse> {
        return await axios.post(`https://www.zohoapis.com/crm/v2/functions/tipa_pro_callback_handler/actions/execute?auth_type=apikey&zapikey=${config.zoho.api_key}`,
            JSON.stringify(dto));
    }

    private feedbackSectionStatus(checked: boolean): ZohoRfqFeedbackSectionStatus {
        return {
            title: 'Approved',
            checked
        }
    }

}