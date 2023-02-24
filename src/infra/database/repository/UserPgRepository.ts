import { injectable, inject } from 'inversify';
import { TYPES } from '../../../container';
import { IUserRepository, UserCriteria } from '../../../domain/user/IUserRepository';
import { UserMap } from '../../../domain/user/UserMap';
import { UserEntity } from '../../../domain/user/UserEntity';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import { UserDto } from '../../../domain/user/UserDto';
import * as _ from 'lodash';
import { UpdateQueryBuilder } from '../queryBuilder/UpdateQueryBuilder';

@injectable()
export class UserPgRepository implements IUserRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async getOne(criteria: UserCriteria): Promise<UserEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query<UserDto>(sql`
            SELECT u.*
            FROM "user" AS u 
            WHERE ${sql.identifier(['u', key])} = ${criteria[key]}`
        );

        const record = result.rowCount ? result.rows[0] : null;

        return UserMap.toDomain(record);
    }

    public async getAll(): Promise<UserEntity[]> {

        const result = await this.conn.query<UserEntity>(
            sql`SELECT * FROM "user"`
        );

        const records = result.rowCount ? result.rows : [];

        return records.map(UserMap.toDomain);
    }

    private expandCriteria(criteria: UserCriteria): string {
        let key = 'email';

        if (typeof criteria['id'] !== 'undefined') {
            key = 'id';
        }

        return key;
    }

    public async create(entity: UserEntity, tx?: DatabaseTransactionConnectionType) {

        return await this.transaction(async (transactionConnection) => {

            const insertResult = await transactionConnection.query<UserEntity>(sql`
                INSERT INTO "user" (
                    role, email, fullname, password
                ) VALUES (
                    ${entity.role}, ${entity.email}, ${entity.fullname}, ${entity.password}
                ) RETURNING id;
            `);

            return insertResult?.rows?.[0]?.id;

        }, tx);

    }

    public async update(criteria: Partial<UserEntity>, update: Partial<UserEntity>): Promise<void> {

        const query = UpdateQueryBuilder.build('user', update, criteria);

        if (!query) {
            return
        }

        await this.conn.query(query) as any;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM "user" WHERE id = ${id}`);
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