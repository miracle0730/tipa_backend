import { injectable, inject } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { JsonController, Post, HttpCode, Body, Get, QueryParam, Authorized, Param } from 'routing-controllers';
import { ResponseSchema, OpenAPI } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import { ZohoCreateRFQDto, ZohoFastTrackPriceListDto, ZohoOpportunityDto, ZohoSuccessResponse } from '../../../domain/zoho/ZohoDto';
import { ZohoCreateRFQUseCase } from '../../../domain/zoho/ZohoCreateRFQUseCase';
import { UserRole } from '../../../domain/user/UserEntity';
import { ZohoGetOpportunityUseCase } from '../../../domain/zoho/ZohoGetOpportunityUseCase';
import { ZohoCalculatePriceUseCase } from '../../../domain/zoho/ZohoCalculatePriceUseCase';
import { ZohoGetRfqInfoUseCase } from '../../../domain/zoho/ZohoGetRfqInfoUseCase';
import { FTItems } from '../../../domain/application/ApplicationDto';
import { ZohoCalculateFastTrackPriceListUseCase } from '../../../domain/zoho/ZohoCalculateFastTrackPriceListUseCase';

@injectable()
@JsonController()
export class ZohoController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ZohoCreateRFQUseCase) private zohoCreateRFQUseCase: IUseCase<ZohoSuccessResponse>,
        @inject(ZohoGetOpportunityUseCase) private zohoGetOpportunityUseCase: IUseCase<ZohoOpportunityDto>,
        @inject(ZohoCalculatePriceUseCase) private zohoCalculatePriceUseCase: IUseCase<ZohoCreateRFQDto>,
        @inject(ZohoGetRfqInfoUseCase) private zohoGetRfqInfoUseCase: IUseCase<ZohoCreateRFQDto>,
        @inject(ZohoCalculateFastTrackPriceListUseCase) private zohoCalculateFastTrackPriceListUseCase: IUseCase<ZohoFastTrackPriceListDto[]>
    ) {
        super();
        this.logger.setPrefix('http:controller:zoho');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/zoho/opportunity/:opportunity_id')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(ZohoOpportunityDto, {
        description: 'get opportunity from ZOHO CRM'
    })
    public async getOpportunity(
        @Param('opportunity_id') opportunity_id: string
    ): Promise<ZohoOpportunityDto> {

        const opportunityInfo = await this.zohoGetOpportunityUseCase.execute(opportunity_id);

        return opportunityInfo;

    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Post('/api/v1/zoho/rfq')
    @OpenAPI({
        description: ``,
        security: [{}]
    })
    @ResponseSchema(ZohoSuccessResponse, {
        description: 'create RFQ on ZOHO CRM'
    })
    public async createRFQ(
        @Body() dto: ZohoCreateRFQDto,
        @QueryParam('can_be_priced') can_be_priced: boolean
    ): Promise<ZohoSuccessResponse> {

        return await this.zohoCreateRFQUseCase.execute(dto, can_be_priced);

    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Post('/api/v1/zoho/rfq/price-estimation')
    @OpenAPI({
        description: `Request for calculate priced item`,
        security: [{}]
    })
    @ResponseSchema(ZohoCreateRFQDto)
    public async priceEstimation(
        @Body() dto: ZohoCreateRFQDto,
        @QueryParam('calculate_moq') calculate_moq: boolean
    ): Promise<ZohoCreateRFQDto> {

        return await this.zohoCalculatePriceUseCase.execute(dto, calculate_moq);

    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/zoho/rfq/:rfq_id')
    @OpenAPI({
        description: `get rfq item by id from ZOHO CRM`,
        security: [{}]
    })
    @ResponseSchema(ZohoCreateRFQDto, {
        description: 'get rfq item by id from ZOHO CRM'
    })
    public async getRfqItem(
        @Param('rfq_id') rfq_id: string
    ): Promise<ZohoCreateRFQDto> {

        const rfqItemInfo = await this.zohoGetRfqInfoUseCase.execute(rfq_id);

        return rfqItemInfo;

    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Post('/api/v1/zoho/rfq/price-list')
    @OpenAPI({
        description: `Request for calculate price list`,
        security: [{}]
    })
    @ResponseSchema(ZohoFastTrackPriceListDto, { isArray: true })
    public async calculatePriceList(
        @Body() dto: FTItems
    ): Promise<ZohoFastTrackPriceListDto[]> {

        return await this.zohoCalculateFastTrackPriceListUseCase.execute(dto);

    }

}