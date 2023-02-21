import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { BadRequestError, InternalServerError, UnauthorizedError } from 'routing-controllers';
import { UserEntity } from './UserEntity';
import { IUserRepository } from './IUserRepository';
import { ILogger } from '../ILogger';
import { config } from '../../infra/config';
import { Auth, JwtType } from '../auth/Auth';

@injectable()
export class UserAuthUseCase implements IUseCase<UserEntity> {

    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository,
        @inject(TYPES.Auth) private auth: Auth
    ) { }

    public async execute(token: string): Promise<UserEntity> {
        try {

            let decoded = await this.auth.verifyToken(token, JwtType.LOGIN);

            const user = await this.repo.getOne({ id: decoded.id });

            if (!user) {
                throw new UnauthorizedError('User not found');
            }

            return user;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}