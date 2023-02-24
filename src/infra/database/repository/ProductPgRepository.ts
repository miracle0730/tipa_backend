import {injectable, inject} from 'inversify';
import {DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType} from 'slonik';
import {TYPES} from '../../../container';
import {IProductRepository} from '../../../domain/product/IProductRepository';
import {ProductEntity} from '../../../domain/product/ProductEntity';
import {ProductMap} from '../../../domain/product/ProductMap';
import {UpdateQueryBuilder} from '../queryBuilder/UpdateQueryBuilder';

@injectable()
export class ProductPgRepository implements IProductRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) {
    }

    public async getOne(criteria: number): Promise<ProductEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query(sql`
                SELECT 
                    p.id, p.title, p.stage, p.description, p.family, p.certifications, p.thickness, 
                    p.tds, p.msds, p.collaterals, p.technical_considerations, p.width, p.features, p.segment, p.segment_type,
                    p."created_at", p."updated_at", p.draft, p.terms_and_limitations, p.manufacturing_technique, p.application, 
                    p.display_priority, p.barrier, p.printability, p.rtf, p.printing_stage, p.packed_goods, p.additional_features,
                    p.level_of_clearance, p.certificates, pi.image, p.printing_method, p.available_territories, p.moq, p.partner_name,
                    p.production_site, p.notes_area
                FROM product AS p
                LEFT JOIN product_image AS pi ON p.id = pi."product_id"
                WHERE ${sql.identifier(['p', key])} = ${criteria}`
        ) as any;

        let record = result.rowCount ? result.rows[0] : null;

        if (!record) {
            return null;
        }

        const [...queryResult] = result.rows;

        record.images = queryResult
            .map(product => product.image)
            .filter(img => img !== null);

        return ProductMap.toDomain(record);
    }

    public async getAll(): Promise<ProductEntity[]> {

        const resultFromProduct = await this.conn.query(sql`
                SELECT 
                    p.id, p.title, p.stage, p.description, p.family, p.certifications, p.thickness, 
                    p.tds, p,msds, p.collaterals, p.technical_considerations, p.width, p.features, p.segment, p.segment_type,
                    p."created_at", p."updated_at", p.draft, p.terms_and_limitations, p.manufacturing_technique, p.application, 
                    p.display_priority, p.barrier, p.printability, p.rtf, p.printing_stage, p.packed_goods, p.additional_features, 
                    p.level_of_clearance,p.certificates,pi.image, p.printing_method, p.available_territories, p.moq, p.partner_name,
                    p.production_site, p.notes_area
                FROM product AS p
                LEFT JOIN product_image AS pi ON p.id = pi."product_id"
                `) as any;

        const products = this.fromDbResultToProductEntity(resultFromProduct);

        return products.map(ProductMap.toDomain);

    }

    public async getByCategories(categoryIds: number[]): Promise<ProductEntity[]> {

        const resultFromProduct = await this.conn.query(sql`
                SELECT 
                    p.id, p.title, p.stage, p.description, p.family, p.certifications, p.thickness, 
                    p.tds, p.msds, p.collaterals, p.technical_considerations, p.width, p.features, p.segment, p.segment_type,
                    p."created_at", p."updated_at", p.draft, p.terms_and_limitations, p.manufacturing_technique, p.application,
                    p.display_priority, p.barrier, p.printability, p.rtf, p.printing_stage, p.packed_goods, p.additional_features,
                    p.certificates,p.level_of_clearance, p.printing_method, p.available_territories, p.moq, p.partner_name,
                    p.production_site, p.notes_area
                FROM product AS p
                WHERE p.segment && ${sql.array(categoryIds, 'int4')} OR p.family && ${sql.array(categoryIds, 'int4')} OR p.packed_goods && ${sql.array(categoryIds, 'int4')} OR p.segment_type && ${sql.array(categoryIds, 'int4')} 
                `) as any;

        const products = resultFromProduct.rows || [];

        return products.map(ProductMap.toDomain);

    }

    public async create(entity: ProductEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const result = await this.conn.query(sql`
                INSERT INTO product (
                    title, stage, description, family, segment, segment_type, thickness, width, features,
                    technical_considerations, tds, msds, collaterals, certifications, draft, terms_and_limitations, manufacturing_technique, application,
                    display_priority, barrier, printability, rtf, printing_stage, packed_goods, additional_features, level_of_clearance,certificates,
                    printing_method, available_territories, moq,partner_name, production_site, notes_area
                ) VALUES (
                    ${entity.title}, ${entity.stage}, ${entity.description}, ${sql.array(entity.family, 'int4')}, 
                    ${sql.array(entity.segment, 'int4')}, ${sql.array(entity.segment_type, 'int4')}, ${JSON.stringify(entity.thickness)}, ${JSON.stringify(entity.width)},
                    ${entity.features}, ${JSON.stringify(entity.technical_considerations)}, 
                    ${JSON.stringify(entity.tds)}, ${JSON.stringify(entity.msds)}, ${JSON.stringify(entity.collaterals)}, ${JSON.stringify(entity.certifications)}, ${entity.draft}, 
                    ${entity.terms_and_limitations}, ${entity.manufacturing_technique}, ${sql.array(entity.application, 'int4')},
                    ${entity.display_priority}, ${JSON.stringify(entity.barrier)}, ${JSON.stringify(entity.printability)},
                    ${entity.rtf}, ${entity.printing_stage}, ${sql.array(entity.packed_goods, 'int4')}, ${JSON.stringify(entity.additional_features)},
                    ${entity.level_of_clearance}, ${JSON.stringify(entity.certificates)}, ${JSON.stringify(entity.printing_method)},${JSON.stringify(entity.available_territories)},
                    ${JSON.stringify(entity.moq)},${sql.array(entity.partner_name, 'int4')}, ${entity.production_site}, ${entity.notes_area}
                    ) RETURNING id;
            `) as any;

        return result?.rows?.[0]?.id;
    }

    public async update(criteria: Partial<ProductEntity>, update: Partial<ProductEntity>, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const query = UpdateQueryBuilder.build('product', update, criteria);

        if (!query) {
            return
        }

        const result = await this.conn.query(query) as any;

        return result?.rows?.[0]?.id;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM product WHERE id = ${id}`);
    }

    public async search(query: string): Promise<ProductEntity[]> {

        const resultFromProduct = await this.conn.query(sql`
                SELECT 
                    p.id, p.title, p.stage, p.description, p.family, p.certifications, p.thickness, 
                    p.tds, p.msds, p.collaterals, p.technical_considerations, p.width, p.features, p.segment, p.segment_type,
                    p."created_at", p."updated_at", p.draft, p.terms_and_limitations, p.manufacturing_technique, p.application,
                    p.display_priority, p.barrier, p.printability, p.rtf, p.printing_stage, p.packed_goods, p.additional_features,
                    p.level_of_clearance,p.certificates,pi.image, p.printing_method, p.available_territories, p.moq, p.partner_name,
                    p.production_site, p.notes_area
                FROM product AS p
                LEFT JOIN product_image AS pi ON p.id = pi."product_id"
                WHERE ${sql.identifier(['p', 'title'])} ~* ${query}
                OR ${sql.identifier(['p', 'description'])} ~* ${query}
            `) as any;

        const products = this.fromDbResultToProductEntity(resultFromProduct);

        return products.map(ProductMap.toDomain);

    }

    private fromDbResultToProductEntity(resultFromDb: any): ProductEntity[] {

        let [...products] = resultFromDb.rows;

        const uniqProducts: ProductEntity[] = [];

        const isUniq = (product_id): boolean => !uniqProducts.some(product => product.id === product_id);

        const validateProduct = (product: ProductEntity): any => {

            if (isUniq(product.id)) {

                product.images = products
                    .filter(productToCompare => product.id === productToCompare.id)
                    .map(product => product.image)
                    .filter(img => img !== null);

                uniqProducts.push(product);
            }
        };

        products.forEach(product => validateProduct(product));

        return uniqProducts;
    }

    public async getAllByCertificateId(certificate_id: number): Promise<ProductEntity[]> {
        const criteria = [{certificate_id}];
        const resultFromProduct = await this.conn.query(sql`
                SELECT *
                FROM product
                WHERE certificates @> ${JSON.stringify(criteria)}
            `) as any;

        const records = resultFromProduct.rowCount ? resultFromProduct.rows : [];

        return records.map(ProductMap.toDomain);
    }

    private expandCriteria(criteria: number): string {
        let key = 'title';

        if (typeof criteria !== 'string' || 'undefined') {
            key = 'id';
        }

        return key;
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