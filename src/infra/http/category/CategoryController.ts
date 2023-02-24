import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, HttpError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IUseCase } from '../../../domain/IUseCase';
import { CategoryDto, CategoryUpdateDto, CategoryCreateDto } from '../../../domain/category/CategoryDto';
import { CategoryEntity } from '../../../domain/category/CategoryEntity';
import { CategoryGetAllUseCase } from '../../../domain/category/CategoryGetAllUseCase';
import { CategoryMap } from '../../../domain/category/CategoryMap';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { CategoryCreateUseCase } from '../../../domain/category/CategoryCreateUseCase';
import { CategoryUpdateUseCase } from '../../../domain/category/CategoryUpdateUseCase';
import { CategoryRemoveUseCase } from '../../../domain/category/CategoryRemoveUseCase';

@injectable()
@JsonController()
export class CategoryController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(CategoryGetAllUseCase) private categoryGetAllUseCase: IUseCase<CategoryEntity[]>,
        @inject(CategoryCreateUseCase) private categoryCreateUseCase: IUseCase<CategoryEntity>,
        @inject(CategoryUpdateUseCase) private categoryUpdateUseCase: IUseCase<CategoryEntity>,
        @inject(CategoryRemoveUseCase) private categoryRemoveUseCase: IUseCase<CategoryEntity>,
    ) {
        super();
        this.logger.setPrefix('http:controller:category');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/category')
    @OpenAPI({
        description: `Get all categories`
    })
    @ResponseSchema(CategoryDto, { isArray: true })
    public async getAll(): Promise<CategoryDto[]> {

        const categories = await this.categoryGetAllUseCase.execute();

        return categories.map(CategoryMap.toDto);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/category')
    @OpenAPI({
        description: `Create category`,
        security: [{}]
    })
    @ResponseSchema(CategoryCreateDto)
    public async create(
        @CurrentUser() user: UserEntity,
        @Body() dto: CategoryCreateDto): Promise<CategoryDto> {

        const createdCategory = await this.categoryCreateUseCase.execute(dto);

        if (!createdCategory) {
            throw new HttpError(400, 'You cannot create a category.');
        }

        return CategoryMap.toDto(createdCategory);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Put('/api/v1/category/:category_id')
    @OpenAPI({
        description: `Update category`,
        security: [{}]
    })
    @ResponseSchema(CategoryDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: CategoryUpdateDto,
        @Param('category_id') category_id: number): Promise<CategoryDto> {

        const updatedCategory = await this.categoryUpdateUseCase.execute(dto, category_id);

        if (!updatedCategory) {
            throw new HttpError(400, 'The category has not been updated!');
        }

        return CategoryMap.toDto(updatedCategory);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Delete('/api/v1/category/:category_id')
    @OpenAPI({
        description: `
        \nThis method will remove category only if related data (applications, products) are removed
        `
    })
    @ResponseSchema(null)
    public async remove(
        @Param('category_id') category_id: number,
    ): Promise<null> {

        await this.categoryRemoveUseCase.execute(category_id);

        return null;
    }

}