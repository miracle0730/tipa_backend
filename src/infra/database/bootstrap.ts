import { inject, injectable } from 'inversify';
import { TYPES } from '../../container';
import { DatabasePoolConnectionType, sql } from 'slonik';
import { ILogger } from '../../domain/ILogger';
import { Auth } from '../../domain/auth/Auth';

@injectable()
export class DatabaseBootstrap {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType,
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth
    ) {
        this.logger.setPrefix('db:bootstrap');
    }

    async start() {
        // could be useful to bootstrap some data in database
        return null;
    }

}