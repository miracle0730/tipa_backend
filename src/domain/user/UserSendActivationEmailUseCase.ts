import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { UserSendEmailResponseDto, UserSignUpDto } from './UserDto';
import { ILogger } from '../ILogger';
import { Auth, JwtType } from '../auth/Auth';
import { config } from '../../infra/config';
import { EmailService } from '../services/EmailService';
import { CheckIsEmailFromAllowedDomains } from './CheckIsEmailFromAllowedDomains';
import { IUserRepository } from './IUserRepository';
import { HttpError } from 'routing-controllers';


@injectable()
export class UserSendActivationEmailUseCase implements IUseCase<UserSendEmailResponseDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth,
        @inject(EmailService) private emailService: EmailService,
        @inject(TYPES.UserRepository) private userRepo: IUserRepository

    ) { }

    public async execute(dto: UserSignUpDto): Promise<UserSendEmailResponseDto> {
        try {

            dto.email = dto.email.toLowerCase();

            CheckIsEmailFromAllowedDomains.check(dto.email);

            const foundedUser = await this.userRepo.getOne({ email: dto.email });

            if (foundedUser) {
                throw new HttpError(409, 'User already exists');
            }

            const signUpToken = this.auth.signToken({ email: dto.email, type: JwtType.SIGN_UP });

            const data = {
                from: config.mailgun.mail,
                to: dto.email,
                subject: 'Welcome to TIPA PRO!',
                template: 'account_activation',
                'v:activation_link': `${config.frontendHost}/signup?token=${signUpToken}`,
                'o:tag': 'activation',
                't:text': 'yes',
                't:version': 'plain'
            };

            this.emailService.send(data);

            return { message: 'An activation link was sent to you. Please check your email and click this link to activate.' };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}