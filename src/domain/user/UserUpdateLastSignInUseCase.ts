import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { UserEntity } from './UserEntity';
import { IUserRepository } from './IUserRepository';
import { ILogger } from '../ILogger';
import { InvalidInputError, SlonikError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class UserUpdateLastSignInUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository,
    ) { }

    public async execute(dto: UserEntity): Promise<void> {
        try {

            await this.repo.update({ id: dto.id }, { last_sign_in: dto.last_sign_in });

        } catch (err) {
            this.logger.error(err);
            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'User must have a unique email!');
            }

            if (err instanceof InvalidInputError) {
                throw new HttpError(400, 'Some input fields are entered incorrectly!')
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The user has not been updated!')
            }

            throw err;
        }

    }

}