import { injectable, inject } from 'inversify';
import { TYPES } from '../../../container';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import * as slonikUtilities from 'slonik-utilities';
import moment = require('moment');
import * as _ from 'lodash';
import { UpdateQueryBuilder } from '../queryBuilder/UpdateQueryBuilder';
import { ISettingsRepository, SettingsCriteria } from '../../../domain/settings/ISettingsRepository';
import { SettingsEntity } from '../../../domain/settings/SettingsEntity';
import { SettingsMap } from '../../../domain/settings/SettingsMap';

@injectable()
export class SettingsPgRepository implements ISettingsRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async getOne(criteria: SettingsCriteria): Promise<SettingsEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query<SettingsEntity>(
            sql`SELECT * FROM settings AS t WHERE ${sql.identifier(['t', key])} = ${criteria[key]} LIMIT 1`
        );

        const record = result.rowCount ? result.rows[0] : null;

        return SettingsMap.toDomain(record);
    }

    public async getAll(): Promise<SettingsEntity[]> {

        const result = await this.conn.query<SettingsEntity>(
            sql`SELECT * FROM settings ORDER BY value asc`
        );

        const records = result.rowCount ? result.rows : [];

        return records.map(SettingsMap.toDomain);
    }

    private expandCriteria(criteria: SettingsCriteria): string {
        let key = 'value';
        if (typeof criteria['id'] !== 'undefined') {
            key = 'id';
        }

        return key;
    }

    public async create(entity: SettingsEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const insertResult = await this.conn.query<SettingsEntity>(sql`
                INSERT INTO settings (
                    value
                ) VALUES (
                    ${entity.value}
                ) RETURNING id;
            `);

        return insertResult?.rows?.[0]?.id;

    }

    public async update(criteria: Partial<SettingsEntity>, update: Partial<SettingsEntity>, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const query = UpdateQueryBuilder.build('settings', update, criteria);

        if (!query) {
            return
        }

        const result = await this.conn.query(query) as any;

        return result?.rows?.[0]?.id;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM settings WHERE id = ${id}`);
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