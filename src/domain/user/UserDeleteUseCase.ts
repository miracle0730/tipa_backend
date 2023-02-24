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
export class UserDeleteUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(userId: number): Promise<void> {
        try {
            const user = await this.repo.getOne({ id: userId });

            if (!user || user.role == UserRole.ADMIN) {
                throw new HttpError(400, 'User cannot be deleted');
            }

            await this.repo.remove(userId);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The user has not been updated!')
            }

            throw err;
        }

    }
}