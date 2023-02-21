import { IRepository } from '../IRepository';
import { ThicknessEntity } from './ThicknessEntity';

export interface IThicknessCriteria {
    id?: number;
    value?: number;
}

export type ThicknessCriteria = IThicknessCriteria;

export interface IThicknessRepository extends IRepository<ThicknessEntity> {
    getAll(): Promise<ThicknessEntity[]>;
}