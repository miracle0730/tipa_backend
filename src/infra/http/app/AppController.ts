import { Controller } from '../Controller';
import { injectable, inject } from 'inversify';
import { ILogger } from '../../../domain/ILogger';
import { App } from '../../App';
import { TYPES } from '../../../container';
import { HealthDto, VersionDto } from '../../../domain/app/AppDto';
import { JsonController, Get, InternalServerError, ContentType } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Apidoc } from '../../Apidoc';

@injectable()
@JsonController()
export class AppController extends Controller {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(App) private app: App,
        @inject(Apidoc) private apidoc: Apidoc
    ) {
        super();
        this.logger.setPrefix('http:controller:app');
        this.logger.info('constructor');
    }

    @Get('/api/health')
    @ResponseSchema(HealthDto)
    public async healthz(): Promise<HealthDto> {
        if (!this.app.isReady()) {
            throw new InternalServerError('App is not ready!');
        }

        return { status: 'ok' };
    }

    @Get('/api/metrics')
    @ResponseSchema(null)
    public async metrics(): Promise<any> {
        this.logger.info('@todo: metrics');
        return {};
    }

    @Get('/api/version')
    @ResponseSchema(VersionDto)
    public async version(): Promise<VersionDto> {
        return {
            build: process.env.CI_BUILD,
            commit: process.env.CI_COMMIT,
            env: process.env.ENVIRONMENT,
        };
    }

    @Get('/apidoc/developer')
    @ContentType('text/html')
    public async apidocDeveloper(): Promise<any> {
        return this.apidoc.getDocContent('developerspec.json');
    }

    @Get('/apidoc/developerspec.json')
    public async developerspec(): Promise<any> {
        return this.apidoc.getFullSpec();
    }
}