import { IRepository } from '../IRepository';
import { CategoryEntity } from './CategoryEntity';

export interface ICategoryCriteria {
    id?: string;
    title?: string;
    parent_id?: string;
}

export type CategoryCriteria = ICategoryCriteria;

export interface ICategoryRepository extends IRepository<CategoryEntity> {
    getAll(): Promise<CategoryEntity[]>;
}