import { inject, injectable } from 'inversify';
import axios, { AxiosResponse } from 'axios';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { config } from '../../infra/config'
import { ZohoErrorCodes } from './ZohoClient';
import { HttpError } from 'routing-controllers';
import { ZohoCreateRFQDto } from './ZohoDto';

@injectable()
export class ZohoGetRfqInfoUseCase implements IUseCase<ZohoCreateRFQDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger
    ) { }

    public async execute(rfq_id: string): Promise<ZohoCreateRFQDto> {

        try {

            const response = await this.getRfqInfo(rfq_id);

            if (response.data?.code === ZohoErrorCodes.INVALID_DATA_CODE) {
                throw new HttpError(400, 'Invalid data message from zoho');
            }

            if (JSON.parse(response?.data?.details?.output)?.status === ZohoErrorCodes.ERROR_STATUS) {
                throw new HttpError(400, `${JSON.parse(response?.data?.details?.output?.message)}` || 'error on Zoho CRM side');
            }

            const { tipa } = JSON.parse(response.data?.details?.output);

            if (!tipa) {
                throw new HttpError(404, `Couldn't get data from zoho`);
            }

            return JSON.parse(tipa);

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

    private async getRfqInfo(rfq_id: string): Promise<AxiosResponse> {
        return await axios.post(`https://www.zohoapis.com/crm/v2/functions/get_rfq_by_id_rest/actions/execute?auth_type=apikey&zapikey=${config.zoho.api_key}`,
            JSON.stringify({ rfq_id }));
    }

}