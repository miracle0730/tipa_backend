import {injectable, inject} from 'inversify';
import {DatabasePoolConnectionType, DatabaseTransactionConnectionType, sql, TransactionFunctionType} from 'slonik';
import * as _ from 'lodash';
import {TYPES} from '../../../container';
import {IApplicationRepository} from '../../../domain/application/IApplicationRepository';
import {ApplicationEntity} from '../../../domain/application/ApplicationEntity';
import {ApplicationMap} from '../../../domain/application/ApplicationMap';
import {UpdateQueryBuilder} from '../queryBuilder/UpdateQueryBuilder';

@injectable()
export class ApplicationPgRepository implements IApplicationRepository {

    constructor(
        @inject(TYPES.DefaultConnection) private conn: DatabasePoolConnectionType
    ) {
    }

    public async getOne(criteria: number): Promise<ApplicationEntity> {
        let key = this.expandCriteria(criteria);

        const result = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
                WHERE ${sql.identifier(['a', key])} = ${criteria}`
        ) as any;

        let record = result.rowCount ? result.rows[0] : null;

        if (!record) {
            return null;
        }

        const [...queryResult] = result.rows;

        record.images = queryResult
            .map(application => application.image)
            .filter(img => img !== null);

        return ApplicationMap.toDomain(record);

    }

    public async getByApplicationNumber(application_number: string): Promise<ApplicationEntity[]> {

        const result = await this.conn.query(sql`
                SELECT *
                FROM application
                WHERE fast_track->>'application_number' = ${application_number}`
        ) as any;

        let record = result.rowCount ? result.rows : null;

        if (!record) {
            return null;
        }

        return record.map(ApplicationMap.toDomain);

    }

    public async getAll(application: number, segment: number): Promise<ApplicationEntity[]> {

        if (application) {

            const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
                WHERE a.application @> ${sql.array([application], 'int4')}
            `) as any;

            const applications = this.fromDbResultToApplicationEntity(resultFromApplication);

            return applications.map(ApplicationMap.toDomain);
        }

        if (segment) {

            const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
                WHERE a.segment @> ${sql.array([segment], 'int4')}
            `) as any;

            const applications = this.fromDbResultToApplicationEntity(resultFromApplication);

            return applications.map(ApplicationMap.toDomain);
        }

        const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
            `) as any;

        const applications = this.fromDbResultToApplicationEntity(resultFromApplication);

        return applications.map(ApplicationMap.toDomain);

    }

    public async getByCategories(categoryIds: number[]): Promise<ApplicationEntity[]> {

        const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority,
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    a."created_at", a."updated_at"
                FROM application AS a
                WHERE a.segment && ${sql.array(categoryIds, 'int4')} ${sql` OR `} a.segment_type && ${sql.array(categoryIds, 'int4')} ${sql` OR `} a.packed_goods && ${sql.array(categoryIds, 'int4')} ${sql` OR `} a.application && ${sql.array(categoryIds, 'int4')}
            `) as any;

        const applications = resultFromApplication.rows || [];

        return applications.map(ApplicationMap.toDomain);

    }

    public async create(entity: ApplicationEntity, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const result = await this.conn.query(sql`
                INSERT INTO application (
                    type, stage, description, application, segment, segment_type, packed_goods, product, thickness, width, height,
                    production_process, tipa_production_site, technical_considerations, features, 
                    positive_experiments, negative_feedback_to_be_aware_of, dieline,
                    customers, draft, additional_features, terms_and_limitations, available_marketing_samples, display_priority,
                    rtf, certifications, streams, fast_track,level_of_clearance,certificates,
                    printing_method, partner_name, production_site, notes_area
                ) VALUES (
                    ${entity.type}, ${entity.stage}, ${entity.description}, ${sql.array(entity.application, 'int4')},
                    ${sql.array(entity.segment, 'int4')}, ${sql.array(entity.segment_type, 'int4')}, ${sql.array(entity.packed_goods, 'int4')},
                    ${sql.array(entity.product, 'int4')}, ${JSON.stringify(entity.thickness)}, ${JSON.stringify(entity.width)},
                    ${JSON.stringify(entity.height)}, ${entity.production_process}, ${entity.tipa_production_site}, 
                    ${JSON.stringify(entity.technical_considerations)}, ${entity.features}, ${entity.positive_experiments}, 
                    ${entity.negative_feedback_to_be_aware_of}, ${JSON.stringify(entity.dieline)}, 
                    ${JSON.stringify(entity.customers)}, ${entity.draft}, ${JSON.stringify(entity.additional_features)}, ${entity.terms_and_limitations},
                    ${JSON.stringify(entity.available_marketing_samples)}, ${entity.display_priority}, ${entity.rtf}, ${JSON.stringify(entity.certifications)},
                    ${JSON.stringify(entity.streams)}, ${JSON.stringify(entity.fast_track)},${entity.level_of_clearance}, ${JSON.stringify(entity.certificates)},
                    ${JSON.stringify(entity.printing_method)}, ${sql.array(entity.partner_name, 'int4')}, ${entity.production_site}, ${entity.notes_area}
                ) RETURNING id;
            `) as any;

        return result?.rows?.[0]?.id;
    }

    public async update(criteria: Partial<ApplicationEntity>, update: Partial<ApplicationEntity>, tx?: DatabaseTransactionConnectionType): Promise<number> {

        const query = UpdateQueryBuilder.build('application', update, criteria);

        if (!query) {
            return
        }

        const result = await this.conn.query(query) as any;

        return result?.rows?.[0]?.id;

    }

    public async remove(id: number): Promise<void> {
        await this.conn.query(sql`DELETE FROM application WHERE id = ${id}`);
    }

    public async getAllByProduct(product_id: number): Promise<ApplicationEntity[]> {

        const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
                WHERE a.product @> ${sql.array([product_id], 'int4')}
            `) as any;

        const applications = this.fromDbResultToApplicationEntity(resultFromApplication);

        return applications.map(ApplicationMap.toDomain);
    }

    public async getApplicationsByType(categoryId: number): Promise<ApplicationEntity> {
        const key = 'type';

        const result = await this.conn.query(sql`
            SELECT *
            FROM application
            WHERE ${sql.identifier(['application', key])} = ${categoryId}`
        ) as any;

        let record = result.rowCount ? result.rows[0] : null;

        if (!record) {
            return null;
        }

        return ApplicationMap.toDomain(record);
    }

    public async getAllByAdditionalFeatures(categoryId: number): Promise<ApplicationEntity[]> {

        const result = await this.conn.query(sql`
            select  *
            from application, 
                    json_array_elements(additional_features) ids(element)      
            where (element->>'ids')::jsonb @> ${sql`${categoryId}`};`
        ) as any;

        const applications = result.rows;

        return applications.map(ApplicationMap.toDomain);
    }

    public async search(query: string): Promise<ApplicationEntity[]> {

        const resultFromApplication = await this.conn.query(sql`
                SELECT 
                    a.id, a.type, a.stage, a.description, a.application, a.segment, a.segment_type, a.packed_goods, a.product, a.thickness, 
                    a.width, a.height, a.production_process, a.tipa_production_site, a.technical_considerations,
                    a.features, a.positive_experiments, a.negative_feedback_to_be_aware_of,
                    a.dieline, a.customers, a.draft, a.additional_features, a.terms_and_limitations, a.display_priority, a."created_at", a."updated_at",
                    ai.image, a.printing_method, a.partner_name, a.production_site, a.notes_area,
                    a.available_marketing_samples, a.rtf, a.certifications, a.streams, a.fast_track,a.level_of_clearance,a.certificates,
                    c.title
                FROM application AS a
                LEFT JOIN application_image AS ai ON a.id = ai."application_id"
                LEFT JOIN category AS c ON a.type = c."id"
                WHERE ${sql.identifier(['c', 'title'])} ~* ${query} 
                OR ${sql.identifier(['a', 'description'])} ~* ${query} 
            `) as any;

        const applications = this.fromDbResultToApplicationEntity(resultFromApplication);

        return applications.map(ApplicationMap.toDomain);

    }

    private fromDbResultToApplicationEntity(resultFromDb: any): ApplicationEntity[] {

        let [...applications] = resultFromDb.rows;

        const uniqApplications: ApplicationEntity[] = [];

        const isUniq = (application_id): boolean => !uniqApplications.some(application => application.id === application_id);

        const validateApplication = (application: ApplicationEntity): any => {

            if (isUniq(application.id)) {

                application.images = applications
                    .filter(applicationToCompare => application.id === applicationToCompare.id)
                    .map(application => application.image)
                    .filter(img => img !== null);

                uniqApplications.push(application);
            }
        };

        applications.forEach(application => validateApplication(application));

        return uniqApplications;
    }

    private expandCriteria(criteria: number): string {
        let key = 'title';

        if (typeof criteria !== 'string' || 'undefined') {
            key = 'id';
        }

        return key;
    }

    public async getAllByCertificateId(certificate_id: number): Promise<ApplicationEntity[]> {
        const criteria = [{certificate_id}];
        const resultFromApplication = await this.conn.query(sql`
                SELECT *
                FROM application
                WHERE certificates @> ${JSON.stringify(criteria)}
            `) as any;

        const records = resultFromApplication.rowCount ? resultFromApplication.rows : [];

        return records.map(ApplicationMap.toDomain);
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