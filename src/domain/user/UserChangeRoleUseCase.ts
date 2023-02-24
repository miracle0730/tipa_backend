import * as bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { IUserRepository } from './IUserRepository';
import {  UserRole } from './UserEntity';
import { UserResetPasswordDto } from './UserDto';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class UserChangeRoleUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(userId: number, roleId: number, tx?: DatabaseTransactionConnectionType): Promise<void> {
        try {
            const user = await this.repo.getOne({ id: userId });

            if (!user) {
                throw new HttpError(400, 'Role is not updated');
            }

            await this.repo.update({ id: userId }, { role: roleId }, tx);


        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The user has not been updated!')
            }

            throw err;
        }

    }

}