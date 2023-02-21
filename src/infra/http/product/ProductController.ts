import { inject, injectable } from 'inversify';
import { Controller } from '../Controller';
import { ILogger } from '../../../domain/ILogger';
import { TYPES } from '../../../container';
import { Authorized, Body, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, HttpError, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserEntity, UserRole } from '../../../domain/user/UserEntity';
import { ProductDto, ProductCreateDto, ProductUpdateDto } from '../../../domain/product/ProductDto';
import { ProductGetAllUseCase } from '../../../domain/product/ProductGetAllUseCase';
import { IUseCase } from '../../../domain/IUseCase';
import { LevelOfClearance, ProductEntity } from '../../../domain/product/ProductEntity';
import { ProductMap } from '../../../domain/product/ProductMap';
import { ProductUpdateUseCase } from '../../../domain/product/ProductUpdateUseCase';
import { ProductRemoveUseCase } from '../../../domain/product/ProductRemoveUseCase';
import { ProductGetOneUseCase } from '../../../domain/product/ProductGetOneUseCase';
import { ProductCreateUseCase } from '../../../domain/product/ProductCreateUseCase';
import { ApplicationGetByProductUseCase } from '../../../domain/application/ApplicationGetByProduct';
import { ApplicationEntity } from '../../../domain/application/ApplicationEntity';
import { CreateDefaultReelUseCase } from '../../../domain/product/CreateDefaultReelUseCase';

@injectable()
@JsonController()
export class ProductController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(ProductGetAllUseCase) private productGetAllUseCase: IUseCase<ProductEntity[]>,
        @inject(ProductGetOneUseCase) private productGetOneUseCase: IUseCase<ProductEntity>,
        @inject(ProductCreateUseCase) private productCreateUseCase: IUseCase<ProductEntity>,
        @inject(ProductUpdateUseCase) private productUpdateUseCase: IUseCase<ProductEntity>,
        @inject(ProductRemoveUseCase) private productRemoveUseCase: IUseCase<ProductEntity>,
        @inject(CreateDefaultReelUseCase) private createDefaultReelUseCase: IUseCase<ApplicationEntity>,
        @inject(ApplicationGetByProductUseCase) private applicationGetByProductUseCase: IUseCase<ApplicationEntity[]>
    ) {
        super();
        this.logger.setPrefix('http:controller:product');
        this.logger.info('constructor');
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/product/:product_id')
    @OpenAPI({
        description: `Get product`
    })
    @ResponseSchema(ProductDto)
    public async getOne(
        @CurrentUser() user: UserEntity,
        @Param('product_id') product_id: number): Promise<ProductDto> {

        const product = await this.productGetOneUseCase.execute(product_id);

        if (!product) {
            throw new HttpError(404, 'Product not found!');
        }

        return ProductMap.toDto(product);
    }

    @Authorized([UserRole.ADMIN, UserRole.SALES, UserRole.COMMERCIAL])
    @HttpCode(200)
    @Get('/api/v1/product')
    @OpenAPI({
        description: `Get products`
    })
    @ResponseSchema(ProductDto, { isArray: true })
    public async getAll(
        @CurrentUser() user: UserEntity,
        @QueryParam('rfq_page') rfq_page: boolean
    ): Promise<ProductDto[]> {
        let products: ProductEntity[] = [];

        products = await this.productGetAllUseCase.execute();

        if (user.role === UserRole.SALES || user.role === UserRole.COMMERCIAL) {
            products = products.filter(product => product.draft === false &&
                product?.level_of_clearance !== LevelOfClearance.ADMIN_LEVEL_ONLY);

            if (rfq_page) {
                products = products.filter(product => product?.level_of_clearance !== LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR);
            }
            if(user.role === UserRole.COMMERCIAL){
                products = products.filter(product =>  product.stage === 1);
            }
            return products.map(ProductMap.toDto);
        }

        return products.map(ProductMap.toDto);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(201)
    @Post('/api/v1/product')
    @OpenAPI({
        description: `Create product`,
        security: [{}]
    })
    @ResponseSchema(ProductDto)
    public async create(
        @CurrentUser() user: UserEntity,
        @Body() dto: ProductCreateDto): Promise<ProductDto> {

        const createdProduct = await this.productCreateUseCase.execute(dto);

        await this.createDefaultReelUseCase.execute(createdProduct);

        return ProductMap.toDto(createdProduct);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Put('/api/v1/product/:product_id')
    @OpenAPI({
        description: `Update product`,
        security: [{}]
    })
    @ResponseSchema(ProductDto)
    public async update(
        @CurrentUser() user: UserEntity,
        @Body() dto: ProductUpdateDto,
        @Param('product_id') product_id: number): Promise<ProductDto> {
        const updatedProduct = await this.productUpdateUseCase.execute(dto, product_id);

        if (!updatedProduct) {
            throw new HttpError(400, 'The product has not been updated!');
        }

        return ProductMap.toDto(updatedProduct);
    }

    @Authorized(UserRole.ADMIN)
    @HttpCode(200)
    @Delete('/api/v1/product/:product_id')
    @OpenAPI({
        description: `Remove product by id - if there is no applications which use this product`
    })
    @ResponseSchema(null)
    public async remove(
        @Param('product_id') product_id: number,
    ): Promise<null> {

        const applications = await this.applicationGetByProductUseCase.execute(product_id);

        if (applications.length) {
            throw new HttpError(400, 'You can not delete this product. You have applications which use it.');
        }

        await this.productRemoveUseCase.execute(product_id);

        return null;
    }

}