import { sql, createPool, ClientConfigurationInputType, DatabasePoolConnectionType } from 'slonik';
import { TYPES } from '../../container';
import { config } from '../config';
import { injectable, inject } from 'inversify';
import { ILogger } from '../../domain/ILogger';

@injectable()
export class ConnectionProvider {
    constructor(@inject(TYPES.Logger) private logger: ILogger) {
        this.logger.setPrefix('db');
    }

    async getConnection(url: string): Promise<DatabasePoolConnectionType> {
        try {

            const poolConfig: ClientConfigurationInputType = {};
            const pool = createPool(url, poolConfig);

            // const conn = await pool.connect(async (connection) => {
            //     console.info('pool connected', connection);
            //     const res = await connection.query(sql`SELECT 1+1`);
            //     console.info('res', JSON.stringify(res, null, 2));
            //     return connection;
            // });

            this.logger.info(`connected to ${url.replace(/\/\/.*\@/, '//xxx:xxx@')}`);
            return pool;
        } catch (err) {
            this.logger.error(`Cannot connect to database`, err);
        }
    }
}