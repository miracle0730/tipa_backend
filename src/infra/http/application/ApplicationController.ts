import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, HttpError, QueryParams, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { ApplicationDto, ApplicationCreateDto, ApplicationUpdateDto, MessageResponseDto, ApplicationNumberAvailabilityDto } from '../../../domain/application/ApplicationDto';
import { IUseCase } from '../../../domain/IUseCase';
import { ApplicationEntity } from '../../../domain/application/ApplicationEntity';
import { ApplicationGetOneUseCase } from '../../../domain/application/ApplicationGetOneUseCase';
import { ApplicationGetAllUseCase } from '../../../domain/application/ApplicationGetAllUseCase';
import { ApplicationCreateUseCase } from '../../../domain/application/ApplicationCreateUseCase';
import { ApplicationUpdateUseCase } from '../../../domain/application/ApplicationUpdateUseCase';
import { ApplicationRemoveUseCase } from '../../../domain/application/ApplicationRemoveUseCase';
import { ApplicationMap } from '../../../domain/application/ApplicationMap';
import { AssociatedApplicationGetAllUseCase } from '../../../domain/application/AssociatedApplicationGetAllUseCase';
import { ApplicationCheckApplicationNumberUseCase } from '../../../domain/application/ApplicationCheckApplicationNumberUseCase';
import { LevelOfClearance } from '../../../domain/product/ProductEntity';

@injectable()
@JsonController()
export class ApplicationController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ApplicationGetAllUseCase) private applicationGetAllUseCase: IUseCase<ApplicationEntity[]>,
        @inject(ApplicationGetOneUseCase) private applicationGetOneUseCase: IUseCase<ApplicationEntity>,
        @inject(ApplicationCreateUseCase) private applicationCreateUseCase: IUseCase<ApplicationEntity>,
        @inject(ApplicationUpdateUseCase) private applicationUpdateUseCase: IUseCase<ApplicationEntity>,
        @inject(ApplicationRemoveUseCase) private applicationRemoveUseCase: IUseCase<ApplicationEntity>,
        @inject(AssociatedApplicationGetAllUseCase) private associatedApplicationGetAllUseCase: IUseCase<ApplicationEntity[]>,
        @inject(ApplicationCheckApplicationNumberUseCase) private applicationCheckApplicationNumberUseCase: IUseCase<void>,

    ) {
        super();
        this.logger.setPrefix('http:controller:application');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/application/:application_id')
    @OpenAPI({
        description: `Get application`
    })
    @ResponseSchema(ApplicationDto)
    public async getOne(
        @Param('application_id') application_id: number): Promise<ApplicationDto> {

        const application = await this.applicationGetOneUseCase.execute(application_id);

        if (!application) {
            throw new HttpError(404, 'Application not found!');
        }

        return ApplicationMap.toDto(application);
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/application')
    @OpenAPI({
        description: `Get applications`
    })
    @ResponseSchema(ApplicationDto, { isArray: true })
    public async getAll(
        @CurrentUser() user: UserEntity,
        @QueryParam('application') application: number = null,
        @QueryParam('segment') segment: number = null,
        @QueryParam('associated') associated: boolean,
        @QueryParam('rfq_page') rfq_page: boolean
    ): Promise<ApplicationDto[]> {
        let applications: ApplicationEntity[] = [];

        if (associated) {
            applications = [...await this.associatedApplicationGetAllUseCase.execute()];
        }

        applications = [...applications, ...await this.applicationGetAllUseCase.execute(application, segment)];

        if (user.role === UserRole.SALES || user.role === UserRole.COMMERCIAL) {
            applications = applications.filter(application => application.draft === false &&
                application?.level_of_clearance !== LevelOfClearance.ADMIN_LEVEL_ONLY);

            if (rfq_page) {
                applications = applications.filter(application => application?.level_of_clearance !== LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR);
            }

            if(user.role === UserRole.COMMERCIAL){
                applications = applications.filter(application => application.stage === 1);
            }
            return applications.map(ApplicationMap.toDto);
        }

        return applications.map(ApplicationMap.toDto);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/application')
    @OpenAPI({
        description: `Create application`,
        security: [{}]
    })
    @ResponseSchema(ApplicationDto)
    public async create(
        @CurrentUser() user: UserEntity,
        @Body() dto: ApplicationCreateDto): Promise<ApplicationDto> {

        const createdApplicationId = await this.applicationCreateUseCase.execute(dto);

        const createdApplication = await this.applicationGetOneUseCase.execute(createdApplicationId);

        return ApplicationMap.toDto(createdApplication);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Put('/api/v1/application/:application_id')
    @OpenAPI({
        description: `Update application`,
        security: [{}]
    })
    @ResponseSchema(ApplicationDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: ApplicationUpdateDto,
        @Param('application_id') application_id: number): Promise<ApplicationDto> {

        const updatedApplication = await this.applicationUpdateUseCase.execute(dto, application_id);

        if (!updatedApplication) {
            throw new HttpError(400, 'The application has not been updated!');
        }

        return ApplicationMap.toDto(updatedApplication);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Delete('/api/v1/application/:application_id')
    @OpenAPI({
        description: `Remove application by id`
    })
    @ResponseSchema(null)
    public async remove(
        @Param('application_id') application_id: number,
    ): Promise<null> {

        await this.applicationRemoveUseCase.execute(application_id);

        return null;
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Post('/api/v1/application/check-number')
    @OpenAPI({
        description: `Check application number availability`
    })
    @ResponseSchema(MessageResponseDto)
    public async checkApplicationNumberAvailability(
        @Body() dto: ApplicationNumberAvailabilityDto
    ): Promise<MessageResponseDto> {

        await this.applicationCheckApplicationNumberUseCase.execute(dto);

        return { message: 'Application number is available' }
    }

}