import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { UserEntity } from './UserEntity';
import { IUserRepository } from './IUserRepository';
import { UserSigninDto } from './UserDto';
import { ILogger } from '../ILogger';
import { Auth, JwtType } from '../auth/Auth';
import { config } from '../../infra/config';
import ms = require('ms');
import { UserValidator } from './UserValidator';

@injectable()
export class UserSigninUseCase implements IUseCase<UserEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.UserRepository) private repo: IUserRepository,
        @inject(TYPES.Auth) private auth: Auth
    ) { }

    public async execute(dto: UserSigninDto): Promise<UserEntity> {
        try {

            dto.email = dto.email.toLowerCase();

            const user = await this.repo.getOne({ email: dto.email });

            UserValidator.validate(user, dto);

            user.tokens = {
                accessToken: this.auth.signToken({ id: user.id, type: JwtType.LOGIN }),
                expiresIn: ms(config.auth.jwt.expiresIn)
            };

            return user;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}