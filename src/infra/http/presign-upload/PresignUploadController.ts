import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, HttpCode, JsonController, Post, Param, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { IUseCase } from '../../../domain/IUseCase';
import { PresignUploadUrlUseCase } from '../../../domain/image/PresignUploadUrlUseCase';
import { PresignUploadDto, PresignUploadRequestDto, PresignUploadQueryParams } from '../../../domain/image/PresignUploadDto';

@injectable()
@JsonController()
export class PresignUploadController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(PresignUploadUrlUseCase) private presignUploadUrlUseCase: IUseCase<PresignUploadDto>,
    ) {
        super();
        this.logger.setPrefix('http:controller:presign-upload');
        this.logger.info('constructor');
    }


    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/presign-upload')
    @OpenAPI({
        description: `Presign-upload`,
        security: [{}]
    })
    @ResponseSchema(PresignUploadDto)
    public async presignUploadImage(
        @CurrentUser() user: UserEntity,
        @QueryParams() queryParams: PresignUploadQueryParams,
        @Body() body: PresignUploadRequestDto): Promise<PresignUploadDto> {

        const presignUploadData = await this.presignUploadUrlUseCase.execute(body, queryParams);
        return presignUploadData;
    }

}