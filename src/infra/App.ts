import { injectable, inject } from 'inversify';
import * as gracefulShutdown from 'http-graceful-shutdown';
import { ILogger } from '../domain/ILogger';
import { TYPES } from '../container';

@injectable()
export class App {
    private ready: boolean = false;
    constructor(
        @inject(TYPES.Logger) private logger: ILogger
    ) {
        this.logger.setPrefix('app');
        this.logger.info('constructor');

        process.on('uncaughtException', function (err) {
            logger.info('uncaughtException', err);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.warn('Config', '###########################');
            logger.warn('Config', 'unhandledRejection: %s %s', reason, promise);
            logger.warn('Config', '###########################');
            promise.catch(err => {
                logger.error('Config', 'unhandledRejection::catch(%s)', err.message);
                logger.error('Config', err);
                process.exit(1);
            });
        });
    }

    public setGracefulShutdown(webserver = null) {
        if (!webserver) {
            process.on('SIGINT', this.stop.bind(this));
            process.on('SIGTERM', this.stop.bind(this));
            return;
        }
        // this enables the graceful shutdown with advanced options
        gracefulShutdown(webserver, {
            signals: 'SIGINT SIGTERM',
            timeout: 10000,
            development: false,
            onShutdown: async () => { this.stop.bind(this); },
            finally: () => {
                this.logger.info('gracefully shut down...');
            }
        });
    }

    public isReady(): boolean {
        return this.ready;
    }

    public async start() {
        this.logger.info(`starting with pid: ${process.pid}`);

        this.ready = true;
        this.logger.info('is ready');
    }

    stop() {
        this.logger.info('cleanup is finished');
        this.ready = false;
        process.exit(0);
    }
}