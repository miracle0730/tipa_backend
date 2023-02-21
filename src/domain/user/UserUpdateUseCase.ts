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
export class UserUpdateUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(dto: UserResetPasswordDto, tx?: DatabaseTransactionConnectionType): Promise<void> {
        try {
            const salt: number = 10;
            const user = await this.repo.getOne({ email: dto.email });

            if (!user) {
                throw new HttpError(400, 'Password is not updated');
            }

            const hashedPassword = bcrypt.hashSync(dto.password, bcrypt.genSaltSync(salt));

            await this.repo.update({ id: user?.id }, { password: hashedPassword }, tx);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The user has not been updated!')
            }

            throw err;
        }

    }

}