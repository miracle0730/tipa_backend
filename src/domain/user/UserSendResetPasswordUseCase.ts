import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { UserSendEmailResponseDto, UserSignUpDto } from './UserDto';
import { ILogger } from '../ILogger';
import { Auth, JwtType } from '../auth/Auth';
import { config } from '../../infra/config';
import { EmailService } from '../services/EmailService';
import { CheckIsEmailFromAllowedDomains } from './CheckIsEmailFromAllowedDomains';

@injectable()
export class UserSendResetPasswordUseCase implements IUseCase<UserSendEmailResponseDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth,
        @inject(EmailService) private emailService: EmailService,

    ) { }

    public async execute(dto: UserSignUpDto): Promise<UserSendEmailResponseDto> {
        try {

            dto.email = dto.email.toLowerCase();

            CheckIsEmailFromAllowedDomains.check(dto.email)

            const resetPasswordToken = this.auth.signToken({ email: dto.email, type: JwtType.RESET_PASSWORD });

            const data = {
                from: config.mailgun.mail,
                to: dto.email,
                subject: 'Reset your password for TIPA PRO',
                template: 'reset_password',
                'o:tag': 'reset_password',
                'v:password_reset_link': `${config.frontendHost}/reset-password?token=${resetPasswordToken}`,
                'v:reset_account': dto.email,
                'v:link_expiration_minutes': 30,
                't:text': 'yes',
                't:version': 'plain'
            };

            this.emailService.send(data);

            return { message: 'An reset password link was sent to you. Please check your email and click this link to reset password.' };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}