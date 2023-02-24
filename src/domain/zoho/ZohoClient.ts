import { inject, injectable } from 'inversify';
import { HttpError } from 'routing-controllers';
import * as ZCRMRestClient from 'zcrmsdk';
import { TYPES } from '../../container';
import { config } from '../../infra/config';
import { ILogger } from '../ILogger';
import { ZohoOpportunityDto } from './ZohoDto';

export enum ZohoModules {
    OPPORTUNITY = 'Deals'
}

export enum ZohoErrorCodes {
    INVALID_TOKEN = 'INVALID_TOKEN',
    INVALID_URL_PATTERN = 'INVALID_URL_PATTERN',
    NO_DATA_STATUS_CODE = '204',
    INVALID_DATA_CODE = 'INVALID_DATA',
    ERROR_STATUS = 'error',
    OK_STATUS = 'ok'
}

@injectable()
export class ZohoClient {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
    ) {
        this.initialiseClient();
    }

    private async initialiseClient(): Promise<void> {
        await ZCRMRestClient.initialize({
            client_id: config.zoho.client_id,
            client_secret: config.zoho.client_secret,
            redirect_url: 'http://localhost:3000', //mandatory, must be any url
            user_identifier: config.zoho.user_identifier,
            tokenmanagement: `${__dirname}/tokenManagement.js`
        });
    }

    public async generateAuthTokenFromRefreshToken(): Promise<void> {
        await ZCRMRestClient.generateAuthTokenfromRefreshToken(config.zoho.user_identifier, config.zoho.refresh_token);
    }

    public async getOpportunity(opportunityId: string): Promise<ZohoOpportunityDto> {

        let opportunityResponse = await ZCRMRestClient.API.MODULES.get({
            id: opportunityId,
            module: ZohoModules.OPPORTUNITY
        });

        let opportunity = await this.parseOpportunityResponse(opportunityResponse);

        if (!opportunity) {
            opportunity = await this.getOpportunity(opportunityId);
        }

        return opportunity;
    }

    private async parseOpportunityResponse(opportunityResponse: any): Promise<ZohoOpportunityDto> {
        try {
            opportunityResponse = JSON.parse(opportunityResponse?.body || opportunityResponse);

            if (opportunityResponse.status_code === ZohoErrorCodes.NO_DATA_STATUS_CODE ||
                opportunityResponse.code === ZohoErrorCodes.INVALID_URL_PATTERN) {
                throw new HttpError(404, 'Opportunity is not found');
            }

            if (opportunityResponse.code === ZohoErrorCodes.INVALID_TOKEN) {
                await this.generateAuthTokenFromRefreshToken();
                return null;
            }

            const opportunity = opportunityResponse?.data[0];

            return {
                id: opportunity.id,
                accountName: opportunity.Account_Name?.name || '',
                name: opportunity.Deal_Name || '',
                owner: opportunity.Owner.name || '',
                user_id: ''
            };

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}