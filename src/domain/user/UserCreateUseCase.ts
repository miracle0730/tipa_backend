import * as bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { IUserRepository } from './IUserRepository';
import { UserCreateDto } from './UserDto';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, SlonikError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { UserRole } from './UserEntity';
import { HttpError } from 'routing-controllers';

@injectable()
export class UserCreateUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository
    ) { }

    public async execute(dto: UserCreateDto, tx?: DatabaseTransactionConnectionType): Promise<void> {
        try {
            const salt: number = 10;

            await this.repo.create({
                role: UserRole.SALES,
                email: dto.email,
                fullname: this.capitalizeFirstLetter(dto.email.split('@')[0]),
                password: bcrypt.hashSync(dto.password, bcrypt.genSaltSync(salt))
            });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'You are registered!');
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The user has not been created!')
            }

            throw err;
        }

    }

    private capitalizeFirstLetter(string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}