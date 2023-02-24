import { IRepository } from '../IRepository';
import { SettingsEntity } from './SettingsEntity';

export interface ISettingsCriteria {
    id?: number;
    value?: number;
}

export type SettingsCriteria = ISettingsCriteria;

export interface ISettingsRepository extends IRepository<SettingsEntity> {
    getAll(): Promise<SettingsEntity[]>;
}