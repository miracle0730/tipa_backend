import * as _ from 'lodash';
import moment = require('moment');
import { sql } from 'slonik';

export class QueryBuilder {

    static prepareKeyValuePairs(scope: any, tableName: string, alias?: string): Array<any> {

        return _.map(scope, (v: any, k: string) => {

            const jsonFields = [
                'customers',
                'certifications',
                'thickness',
                'width',
                'height',
                'additional_features',
                'available_marketing_samples',
                'metadata',
                'streams',
                'tds',
                'msds',
                'fast_track',
                'certificates',
                'printing_method',
                'available_territories',
                'moq'
            ];

            const keys = alias ? [alias, k] : [k];

            if (jsonFields.includes(k)) {
                return sql`${sql.identifier(keys)} = ${JSON.stringify(v)}`;
            }

            if (k === 'updated_at' || k === 'last_sign_in') {
                return sql`${sql.identifier(keys)} = ${moment.utc().toISOString()}`;
            }

            if (_.isArray(v)) {
                return sql`${sql.identifier(keys)} = (${sql.array(v, 'int4')})`;
            }

            if (_.isDate(v)) {
                return sql`${sql.identifier(keys)} = (${v.toString()})`;
            }

            if (_.isObject(v)) {
                return sql`${sql.identifier(keys)} = ${JSON.stringify(v)}`;
            }

            return sql`${sql.identifier(keys)} = ${v}`;
        })

    }

}