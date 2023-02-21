import { injectable, inject } from 'inversify';
import * as Koa from 'koa';
import convert = require('koa-convert');
import * as cors from 'koa-cors';
import * as perfy from 'perfy';
import { config } from '../config';
import { ILogger } from '../../domain/ILogger';
import { RequestMiddleware } from './middlewares/RequestMiddleware';
import { TYPES, container } from '../../container';
import { useContainer, Action, useKoaServer } from 'routing-controllers';
import { AppController } from './app/AppController';
import { AuthController } from './auth/AuthController';
import { CategoryController } from './category/CategoryController';
import { UserAuthUseCase } from '../../domain/user/UserAuthUseCase';
import { UserEntity, UserRole } from '../../domain/user/UserEntity';
import { ApplicationController } from './application/ApplicationController';
import { ProductController } from './product/ProductController';
import { ProfileController } from './user/ProfileController';
import { SearchController } from './search/SearchController';
import { PresignUploadController } from './presign-upload/PresignUploadController';
import { ThicknessController } from './thickness/ThicknessController';
import { ZohoController } from './zoho/ZohoController';

class ExtendedKoa<T, M> extends Koa<T, M> {
}

@injectable()
export class Http {
    private ready: boolean = false;
    public koa: ExtendedKoa<Koa.DefaultState, Koa.DefaultContext>;
    public server: import('http').Server;

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(RequestMiddleware) private requestMiddleware: RequestMiddleware,
    ) {
        this.logger = logger;
        this.logger.setPrefix('http');
        this.logger.info('constructor');
    }

    public isReady(): boolean {
        return this.ready;
    }

    public async start() {
        perfy.start('server');
        return new Promise((resolve) => {
            useContainer(container);

            const koa = new Koa();
            this.koa = koa;

            this.koa.use(convert(cors({
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                headers: 'content-type, authorization'
            })));

            useKoaServer(koa, {
                controllers: [
                    AppController,
                    AuthController,
                    CategoryController,
                    ApplicationController,
                    ProductController,
                    ProfileController,
                    SearchController,
                    PresignUploadController,
                    ThicknessController,
                    ZohoController
                ],
                middlewares: [
                    RequestMiddleware
                ],
                interceptors: [],
                development: false,
                validation: {
                    validationError: { target: false, value: false }
                },
                authorizationChecker: Http.authChecker,
                currentUserChecker: Http.currentUserChecker
            });

            this.server = this.koa.listen(config.port, () => {
                const time = perfy.exists('server') ? perfy.end('server').fullMilliseconds : -1;
                this.logger.info(`started at port: ${config.port} ${time} ms`);
                this.ready = true;
                return resolve();
            });

            this.koa.on('error', (err, ctx) => {
                this.logger.error('error', err, ctx);
                this.ready = false;
            });
        });

    }

    async stop() {
        this.logger.info('cleanup is finished');
        this.ready = false;
    }

    private static async authChecker(action: Action, roles: UserRole[]): Promise<boolean> {

        const tokenStr = action.request.headers['authorization'] || '';
        if (!/^Bearer\s.+$/.test(tokenStr)) {
            return false;
        }

        const token = tokenStr.replace('Bearer ', '');

        const user = await container.get<UserAuthUseCase>(UserAuthUseCase).execute(token);
        if (!user || (roles.length && !roles.includes(user.role))) {
            return false;
        }

        action.context.state.user = { ...user } as UserEntity;

        return true;

    }

    private static async currentUserChecker(action: Action): Promise<UserEntity> {

        return action.context.state?.user;

    }
}