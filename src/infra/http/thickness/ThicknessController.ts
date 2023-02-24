import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, HttpError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { ThicknessGetAllUseCase } from '../../../domain/thickness/ThicknessGetAllUseCase';
import { ThicknessEntity } from '../../../domain/thickness/ThicknessEntity';
import { ThicknessCreateUseCase } from '../../../domain/thickness/ThicknessCreateUseCase';
import { ThicknessUpdateUseCase } from '../../../domain/thickness/ThicknessUpdateUseCase';
import { ThicknessRemoveUseCase } from '../../../domain/thickness/ThicknessRemoveUseCase';
import { ThicknessCreateDto, ThicknessDto, ThicknessUpdateDto } from '../../../domain/thickness/ThicknessDto';
import { ThicknessMap } from '../../../domain/thickness/ThicknessMap';


@injectable()
@JsonController()
export class ThicknessController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ThicknessGetAllUseCase) private thicknessGetAllUseCase: IUseCase<ThicknessEntity[]>,
        @inject(ThicknessCreateUseCase) private thicknessCreateUseCase: IUseCase<ThicknessEntity>,
        @inject(ThicknessUpdateUseCase) private thicknessUpdateUseCase: IUseCase<ThicknessEntity>,
        @inject(ThicknessRemoveUseCase) private thicknessRemoveUseCase: IUseCase<ThicknessEntity>,
    ) {
        super();
        this.logger.setPrefix('http:controller:thickness');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/thickness')
    @OpenAPI({
        description: `Get all thickness`
    })
    @ResponseSchema(ThicknessDto, { isArray: true })
    public async getAll(): Promise<ThicknessDto[]> {

        const thicknesses = await this.thicknessGetAllUseCase.execute();

        return thicknesses.map(ThicknessMap.toDto);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/thickness')
    @OpenAPI({
        description: `Create thickness`,
        security: [{}]
    })
    @ResponseSchema(ThicknessDto)
    public async create(
        @CurrentUser() user: UserEntity,
        @Body() dto: ThicknessCreateDto): Promise<ThicknessDto> {

        const createdThickness = await this.thicknessCreateUseCase.execute(dto);

        if (!createdThickness) {
            throw new HttpError(400, 'You cannot create a thickness.');
        }

        return ThicknessMap.toDto(createdThickness);

    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Put('/api/v1/thickness/:thickness_id')
    @OpenAPI({
        description: `Update thickness`,
        security: [{}]
    })
    @ResponseSchema(ThicknessDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: ThicknessUpdateDto,
        @Param('thickness_id') thickness_id: number): Promise<ThicknessDto> {

        const updatedThickness = await this.thicknessUpdateUseCase.execute(dto, thickness_id);

        if (!updatedThickness) {
            throw new HttpError(400, 'The thickness has not been updated!');
        }

        return ThicknessMap.toDto(updatedThickness);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Delete('/api/v1/thickness/:thickness_id')
    @OpenAPI({
        description: `Remove thickness`
    })
    @ResponseSchema(null)
    public async remove(
        @Param('thickness_id') thickness_id: number,
    ): Promise<null> {

        await this.thicknessRemoveUseCase.execute(thickness_id);

        return null;
    }

}