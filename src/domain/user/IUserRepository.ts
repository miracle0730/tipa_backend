import { IRepository } from '../IRepository';
import { UserEntity } from './UserEntity';

export interface IUserCriteriaGetById {
    id: number;
}

export interface IUserCriteriaGetByEmail {
    email: string;
}

export type UserCriteria = IUserCriteriaGetById | IUserCriteriaGetByEmail;

export interface IUserRepository extends IRepository<UserEntity> {
    getOne(criteria: UserCriteria): Promise<UserEntity>;
    getAll(): Promise<UserEntity[]>;
}