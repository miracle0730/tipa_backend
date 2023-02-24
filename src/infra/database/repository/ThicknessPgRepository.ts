import { injectable, inject } from 'inversify';
import { TYPES } from '../../../container';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import * as slonikUtilities from 'slonik-utilities';
import moment = require('moment');
import * as _ from 'lodash';
import { UpdateQueryBuilder } from '../queryBuilder/UpdateQueryBuilder';
import { IThicknessRepository, ThicknessCriteria } from '../../../domain/thickness/IThicknessRepository';
import { ThicknessEntity } from '../../../domain/thickness/ThicknessEntity';
import { ThicknessMap } from '../../../domain/thickness/ThicknessMap';

@injectable()
export class ThicknessPgRepository implements IThicknessRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async getOne(criteria: ThicknessCriteria): Promise<ThicknessEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query<ThicknessEntity>(
            sql`SELECT * FROM thickness AS t WHERE ${sql.identifier(['t', key])} = ${criteria[key]} LIMIT 1`
        );

        const record = result.rowCount ? result.rows[0] : null;

        return ThicknessMap.toDomain(record);
    }

    public async getAll(): Promise<ThicknessEntity[]> {

        const result = await this.conn.query<ThicknessEntity>(
            sql`SELECT * FROM thickness ORDER BY value asc`
        );

        const records = result.rowCount ? result.rows : [];

        return records.map(ThicknessMap.toDomain);
    }

    private expandCriteria(criteria: ThicknessCriteria): string {
        let key = 'value';
        if (typeof criteria['id'] !== 'undefined') {
            key = 'id';
        }

        return key;
    }

    public async create(entity: ThicknessEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const insertResult = await this.conn.query<ThicknessEntity>(sql`
                INSERT INTO thickness (
                    value
                ) VALUES (
                    ${entity.value}
                ) RETURNING id;
            `);

        return insertResult?.rows?.[0]?.id;

    }

    public async update(criteria: Partial<ThicknessEntity>, update: Partial<ThicknessEntity>, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const query = UpdateQueryBuilder.build('thickness', update, criteria);

        if (!query) {
            return
        }

        const result = await this.conn.query(query) as any;

        return result?.rows?.[0]?.id;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM thickness WHERE id = ${id}`);
    }

    private async transaction(fn: TransactionFunctionType<any>, tx?: DatabaseTransactionConnectionType): Promise<any> {
        if (tx) {
            return fn(tx);
        }

        return await this.conn.transaction(async (tx) => {
            return fn(tx);
        });

    }

}