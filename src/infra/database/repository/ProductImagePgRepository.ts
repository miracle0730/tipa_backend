import { injectable, inject } from 'inversify';
import { DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType } from 'slonik';
import * as slonikUtilities from 'slonik-utilities';
import moment = require('moment');
import * as _ from 'lodash';

import { TYPES } from '../../../container';
import { ProductImageEntityType } from '../../../domain/image/product/ProductImageEntity';
import { IProductImageRepository } from '../../../domain/image/product/IProductImageRepository';

@injectable()
export class ProductImagePgRepository implements IProductImageRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) { }

    public async create(entity: ProductImageEntityType, tx?: DatabaseTransactionConnectionType): Promise<void> {

        const rowsToInsert = entity.images.map((image => {
            return [image, entity.product_id];
        }))

        await this.conn.query<void>(sql`
                INSERT INTO product_image ( image, product_id ) 
                SELECT *
                FROM ${sql.unnest(rowsToInsert, ['text', 'int4'])}
            `) as any;
    }

    public async remove(id: number): Promise<void> {

        await this.conn.query(sql`
                DELETE 
                FROM product_image as img
                WHERE ${sql.identifier(['img', 'product_id'])} = ${id}
            `) as any;
    }

}