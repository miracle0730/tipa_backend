import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, CurrentUser, Get, HttpCode, JsonController, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { IUseCase } from '../../../domain/IUseCase';
import { FullTextSearchDto } from '../../../domain/search/FullTextSearchDto';
import { FullTextSearchUseCase } from '../../../domain/search/FullTextSearchUseCase';

@injectable()
@JsonController()
export class SearchController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(FullTextSearchUseCase) private fullTextSearchUseCase: IUseCase<FullTextSearchDto>
    ) {
        super();
        this.logger.setPrefix('http:controller:search');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/search')
    @OpenAPI({
        description: `Full text search products and applications by title and description`
    })
    @ResponseSchema(FullTextSearchDto)
    public async search(
        @CurrentUser() user: UserEntity,
        @QueryParam('query') query: string
    ): Promise<FullTextSearchDto> {

        let foundApplicationsAndProducts = await this.fullTextSearchUseCase.execute(query);

        if (user.role === UserRole.SALES || user.role === UserRole.COMMERCIAL) {
            foundApplicationsAndProducts.applications = foundApplicationsAndProducts.applications
                .filter(application => application.draft === false);

            foundApplicationsAndProducts.products = foundApplicationsAndProducts.products
                .filter(product => product.draft === false);

        }

        return foundApplicationsAndProducts;
    }

}