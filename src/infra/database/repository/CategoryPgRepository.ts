import { injectable, inject } from 'inversify';
import { TYPES } from '../../../container';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import * as slonikUtilities from 'slonik-utilities';
import { CategoryCriteria, ICategoryRepository } from '../../../domain/category/ICategoryRepository';
import { CategoryEntity, CategoryLevel } from '../../../domain/category/CategoryEntity';
import { CategoryMap } from '../../../domain/category/CategoryMap';
import moment = require('moment');
import * as _ from 'lodash';
import { UpdateQueryBuilder } from '../queryBuilder/UpdateQueryBuilder';

@injectable()
export class CategoryPgRepository implements ICategoryRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async getOne(criteria: CategoryCriteria): Promise<CategoryEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query<CategoryEntity>(
            sql`SELECT * FROM category AS c WHERE ${sql.identifier(['c', key])} = ${criteria[key]} LIMIT 1`
        );

        const record = result.rowCount ? result.rows[0] : null;

        return CategoryMap.toDomain(record);
    }

    public async getAll(): Promise<CategoryEntity[]> {

        const result = await this.conn.query<CategoryEntity>(
            sql`SELECT * FROM category ORDER BY level asc`
        );

        const records = result.rowCount ? result.rows : [];

        return records.map(CategoryMap.toDomain);
    }

    private expandCriteria(criteria: CategoryCriteria): string {
        let key = 'parentId';
        if (typeof criteria['id'] !== 'undefined') {
            key = 'id';
        }

        return key;
    }

    public async create(entity: CategoryEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const insertResult = await this.conn.query<CategoryEntity>(sql`
                INSERT INTO category (
                    parent_id, level, title, metadata
                ) VALUES (
                    ${entity.parent_id}, ${entity.level}, ${entity.title}, ${JSON.stringify(entity.metadata)}
                ) RETURNING id;
            `);

        return insertResult?.rows?.[0]?.id;

    }

    public async update(criteria: Partial<CategoryEntity>, update: Partial<CategoryEntity>, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const query = UpdateQueryBuilder.build('category', update, criteria);

        if (!query) {
            return
        }

        const result = await this.conn.query(query) as any;

        return result?.rows?.[0]?.id;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM category WHERE id = ${id}`);
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