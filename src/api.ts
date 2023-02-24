import 'reflect-metadata';
import { container, TYPES } from './container';
import * as perfy from 'perfy';
import { App } from './infra/App';
import { Logger } from './infra/Logger';
import { Http } from './infra/http/Http';
import { RequestState } from './infra/http/RequestState';
import { ConnectionProvider } from './infra/database/ConnectionProvider';
import { config } from './infra/config';
import { DatabasePoolConnectionType } from 'slonik';
import { RequestMiddleware } from './infra/http/middlewares/RequestMiddleware';
import { AppController } from './infra/http/app/AppController';
import { ILogger } from './domain/ILogger';
import { IUserRepository } from './domain/user/IUserRepository';
import { UserPgRepository } from './infra/database/repository/UserPgRepository';
import { CategoryPgRepository } from './infra/database/repository/CategoryPgRepository';
import { ICategoryRepository } from './domain/category/ICategoryRepository';
import { DatabaseBootstrap } from './infra/database/bootstrap';
import { Auth } from './domain/auth/Auth';
import { CategoryController } from './infra/http/category/CategoryController';
import { ProfileController } from './infra/http/user/ProfileController';
import { ApplicationController } from './infra/http/application/ApplicationController';
import { ProductController } from './infra/http/product/ProductController';
import { ProductImagePgRepository } from './infra/database/repository/ProductImagePgRepository';
import { IApplicationImageRepository } from './domain/image/application/IApplicationImageRepository';
import { ApplicationImagePgRepository } from './infra/database/repository/ApplicationImagePgRepository';
import { IApplicationRepository } from './domain/application/IApplicationRepository';
import { ApplicationPgRepository } from './infra/database/repository/ApplicationPgRepository';
import { ProductPgRepository } from './infra/database/repository/ProductPgRepository';
import { SearchController } from './infra/http/search/SearchController';
import { IProductRepository } from './domain/product/IProductRepository';
import { IProductImageRepository } from './domain/image/product/IProductImageRepository';
import { PresignUploadController } from './infra/http/presign-upload/PresignUploadController';
import { IThicknessRepository } from './domain/thickness/IThicknessRepository';
import { ISettingsRepository } from './domain/settings/ISettingsRepository';
import { ThicknessPgRepository } from './infra/database/repository/ThicknessPgRepository';
import { SettingsPgRepository } from './infra/database/repository/SettingsPgRepository';
import { ThicknessController } from './infra/http/thickness/ThicknessController';
import { SettingsController } from './infra/http/settings/SettingsController';
import { EmailService } from './domain/services/EmailService';
import { ZohoController } from './infra/http/zoho/ZohoController';
import { MicrosoftOfficeClientService } from './domain/services/MicrosoftOfficeClientService';
import { AuthController } from './infra/http/auth/AuthController';

// here we can override which classes we want to instantiate
container.bind<AppController>(AppController).toSelf().inSingletonScope();
container.bind<CategoryController>(CategoryController).toSelf().inSingletonScope();
container.bind<AuthController>(AuthController).toSelf().inSingletonScope();
container.bind<ProfileController>(ProfileController).toSelf().inSingletonScope();
container.bind<ApplicationController>(ApplicationController).toSelf().inSingletonScope();
container.bind<ProductController>(ProductController).toSelf().inSingletonScope();
container.bind<SearchController>(SearchController).toSelf().inSingletonScope();
container.bind<PresignUploadController>(PresignUploadController).toSelf().inSingletonScope();
container.bind<ThicknessController>(ThicknessController).toSelf().inSingletonScope();
container.bind<SettingsController>(SettingsController).toSelf().inSingletonScope();
container.bind<ZohoController>(ZohoController).toSelf().inSingletonScope();
container.bind<Http>(Http).toSelf().inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inRequestScope();
container.bind<App>(App).toSelf().inSingletonScope();
container.bind<RequestState>(RequestState).toSelf().inRequestScope();
container.bind<RequestMiddleware>(RequestMiddleware).toSelf().inRequestScope();
container.bind<ConnectionProvider>(ConnectionProvider).toSelf().inRequestScope();
container.bind<Auth>(TYPES.Auth).to(Auth).inSingletonScope();
container.bind<EmailService>(EmailService).toSelf().inSingletonScope();
container.bind<MicrosoftOfficeClientService>(MicrosoftOfficeClientService).toSelf().inSingletonScope();

(async () => {
    perfy.start('core');
    const logger = container.get<ILogger>(TYPES.Logger);
    logger.setPrefix('core');
    const connectionProvider = container.get<ConnectionProvider>(ConnectionProvider);
    const defaultConnection = await connectionProvider.getConnection(config.db.url);

    container.bind<DatabasePoolConnectionType>(TYPES.DefaultConnection).toConstantValue(defaultConnection);
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserPgRepository).inSingletonScope();
    container.bind<ICategoryRepository>(TYPES.CategoryRepository).to(CategoryPgRepository).inSingletonScope();
    container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductPgRepository).inSingletonScope();
    container.bind<IApplicationRepository>(TYPES.ApplicationRepository).to(ApplicationPgRepository).inSingletonScope();
    container.bind<IProductImageRepository>(TYPES.ProductImageRepository).to(ProductImagePgRepository).inSingletonScope();
    container.bind<IApplicationImageRepository>(TYPES.ApplicationImageRepository).to(ApplicationImagePgRepository).inSingletonScope();
    container.bind<IThicknessRepository>(TYPES.ThicknessRepository).to(ThicknessPgRepository).inSingletonScope();
    container.bind<ISettingsRepository>(TYPES.SettingsRepository).to(SettingsPgRepository).inSingletonScope();

    const app = container.get<App>(App);
    const http = container.get<Http>(Http);
    const databaseBootsrap = container.get<DatabaseBootstrap>(DatabaseBootstrap);

    try {
        await http.start();
        await app.start();

        await databaseBootsrap.start();

        app.setGracefulShutdown(http.server);
        const time = perfy.exists('core') ? perfy.end('core').fullMilliseconds : -1;
        logger.info(`everything is ready in ${time} ms`);
    } catch (err) {
        logger.error('catch error: ', err.stack);
        throw err;
    }
})();

