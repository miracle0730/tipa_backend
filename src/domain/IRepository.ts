import { DatabaseTransactionConnectionType } from 'slonik';

export interface IRepository<T> {
    getOne?(criteria: any): Promise<T>;
    create(entity: T, tx?: DatabaseTransactionConnectionType): Promise<any>;
    update?(criteria: any, entity: Partial<T>, tx?: DatabaseTransactionConnectionType): Promise<any>;
    remove(entityId: number): Promise<void>;
}