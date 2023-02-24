import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, HttpError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { SettingsGetAllUseCase } from '../../../domain/settings/SettingsGetAllUseCase';
import { SettingsEntity } from '../../../domain/settings/SettingsEntity';
import { SettingsCreateUseCase } from '../../../domain/settings/SettingsCreateUseCase';
import { SettingsUpdateUseCase } from '../../../domain/settings/SettingsUpdateUseCase';
import { SettingsRemoveUseCase } from '../../../domain/settings/SettingsRemoveUseCase';
import { SettingsCreateDto, SettingsDto, SettingsUpdateDto } from '../../../domain/settings/SettingsDto';
import { SettingsMap } from '../../../domain/settings/SettingsMap';


@injectable()
@JsonController()
export class SettingsController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(SettingsGetAllUseCase) private SettingsGetAllUseCase: IUseCase<SettingsEntity[]>,
        @inject(SettingsCreateUseCase) private SettingsCreateUseCase: IUseCase<SettingsEntity>,
        @inject(SettingsUpdateUseCase) private SettingsUpdateUseCase: IUseCase<SettingsEntity>,
        @inject(SettingsRemoveUseCase) private SettingsRemoveUseCase: IUseCase<SettingsEntity>,
    ) {
        super();
        this.logger.setPrefix('http:controller:Settings');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/Settings')
    @OpenAPI({
        description: `Get all Settings`
    })
    @ResponseSchema(SettingsDto, { isArray: true })
    public async getAll(): Promise<SettingsDto[]> {

        const Settings = await this.SettingsGetAllUseCase.execute();

        return Settings.map(SettingsMap.toDto);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/Settings')
    @OpenAPI({
        description: `Create Settings`,
        security: [{}]
    })
    @ResponseSchema(SettingsDto)
    public async create(
        @CurrentUser() user: UserEntity,
        @Body() dto: SettingsCreateDto): Promise<SettingsDto> {

        const createdSettings = await this.SettingsCreateUseCase.execute(dto);

        if (!createdSettings) {
            throw new HttpError(400, 'You cannot create a Settings.');
        }

        return SettingsMap.toDto(createdSettings);

    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Put('/api/v1/Settings/:Settings_id')
    @OpenAPI({
        description: `Update Settings`,
        security: [{}]
    })
    @ResponseSchema(SettingsDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: SettingsUpdateDto,
        @Param('Settings_id') Settings_id: number): Promise<SettingsDto> {

        const updatedSettings = await this.SettingsUpdateUseCase.execute(dto, Settings_id);

        if (!updatedSettings) {
            throw new HttpError(400, 'The Settings has not been updated!');
        }

        return SettingsMap.toDto(updatedSettings);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Delete('/api/v1/Settings/:Settings_id')
    @OpenAPI({
        description: `Remove Settings`
    })
    @ResponseSchema(null)
    public async remove(
        @Param('Settings_id') Settings_id: number,
    ): Promise<null> {

        await this.SettingsRemoveUseCase.execute(Settings_id);

        return null;
    }

}