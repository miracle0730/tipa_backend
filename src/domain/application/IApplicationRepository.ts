import { IRepository } from '../IRepository';
import { ApplicationEntity } from './ApplicationEntity';

export interface IApplicationRepository extends IRepository<ApplicationEntity> {
    getAll(...params: any): Promise<ApplicationEntity[]>;
    getAllByProduct(...params: any): Promise<ApplicationEntity[]>;
    search(...params: any): Promise<ApplicationEntity[]>;
    getByCategories(...params: any): Promise<ApplicationEntity[]>;
    getApplicationsByType(...params: any): Promise<ApplicationEntity>;
    getAllByAdditionalFeatures(...params: any): Promise<ApplicationEntity[]>;
    getByApplicationNumber(...params: any): Promise<ApplicationEntity[]>;
    getAllByCertificateId(...params: any): Promise<ApplicationEntity[]>;
}