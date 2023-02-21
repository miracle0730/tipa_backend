import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import _ = require('lodash');
import { UserEntity } from './UserEntity';
import { IUserRepository } from './IUserRepository';

@injectable()
export class UserGetAllUseCase implements IUseCase<UserEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(): Promise<UserEntity[]> {
        try {

            return await this.repo.getAll();

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}