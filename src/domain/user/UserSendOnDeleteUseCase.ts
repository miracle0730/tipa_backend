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
export class UserSendOnDeleteUseCase implements IUseCase<UserSendEmailResponseDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth,
        @inject(EmailService) private emailService: EmailService,

    ) { }

    public async execute(email: string): Promise<UserSendEmailResponseDto> {
        try {

            email = email.toLowerCase();

            CheckIsEmailFromAllowedDomains.check(email)


            const data = {
                from: config.mailgun.mail,
                to: email,
                subject: 'Your account has been deleted for TIPA PRO',
                template: 'account_deleted',
                'o:tag': 'account_deleted',
                'v:account': email,
                't:text': 'yes',
                't:version': 'initial'
            };

            this.emailService.send(data);

            return { message: 'Role has been changed and email was sent to user.' };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}