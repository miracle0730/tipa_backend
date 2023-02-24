import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ZohoCreateRFQDto, ZohoOpportunityDto } from './ZohoDto';
import { ZohoClient } from './ZohoClient';


@injectable()
export class ZohoGetOpportunityUseCase implements IUseCase<ZohoOpportunityDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ZohoClient) private zohoClient: ZohoClient,
    ) { }

    public async execute(opportunityId: string): Promise<ZohoOpportunityDto> {
        try {

            return {
                id: opportunityId,
                accountName: '',
                name: '',
                owner: '',
                user_id: ''
            };

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}