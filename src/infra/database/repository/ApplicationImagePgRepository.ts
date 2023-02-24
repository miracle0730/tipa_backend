import { injectable, inject } from 'inversify';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import * as slonikUtilities from 'slonik-utilities';
import moment = require('moment');
import * as _ from 'lodash';

import { TYPES } from '../../../container';
import { IApplicationImageRepository } from '../../../domain/image/application/IApplicationImageRepository';
import { ApplicationImageEntityType } from '../../../domain/image/application/IApplicationImageEntity';

@injectable()
export class ApplicationImagePgRepository implements IApplicationImageRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async create(entity: ApplicationImageEntityType, tx?: DatabaseTransactionConnectionType): Promise<void> {

        const rowsToInsert = entity.images.map((image => {
            return [image, entity.application_id];
        }))

        await this.conn.query<void>(sql`
                INSERT INTO application_image ( image, application_id ) 
                SELECT *
                FROM ${sql.unnest(rowsToInsert, ['text', 'int4'])}
            `) as any;

    }

    public async remove(id: number): Promise<void> {

        await this.conn.query(sql`
                DELETE 
                FROM application_image as img
                WHERE ${sql.identifier(['img', 'application_id'])} = ${id}
            `) as any;

    }

}