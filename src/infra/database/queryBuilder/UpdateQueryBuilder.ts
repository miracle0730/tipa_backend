import * as _ from 'lodash';
import { QueryResultRowType, sql, SqlSqlTokenType } from 'slonik';
import { QueryBuilder } from './QueryBuilder';

export class UpdateQueryBuilder extends QueryBuilder {

    static build(tableName: string, data: Object, criteria: Object = null): SqlSqlTokenType<QueryResultRowType<string>> {
        if (tableName === '') {
            return null;
        }

        const setData = _.pickBy(data, (value, key) => {
            if (key === 'images') {
                return;
            }

            return value !== criteria[key];
        });

        if (_.isEmpty(setData)) {
            return null;
        }

        const preparedCriteria = UpdateQueryBuilder.prepareKeyValuePairs(criteria, tableName);

        const where = !_.isEmpty(preparedCriteria) ? sql`WHERE ${sql.join(preparedCriteria, sql` AND `)}` : '';

        return sql`
            UPDATE ${sql.identifier([tableName])}
            SET ${sql.join(UpdateQueryBuilder.prepareKeyValuePairs(setData, tableName), sql`, `)}
            ${where}
            RETURNING id;
        `;

    }

}