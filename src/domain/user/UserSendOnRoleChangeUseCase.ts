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
export class UserSendOnRoleChangeUseCase implements IUseCase<UserSendEmailResponseDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Auth) private auth: Auth,
        @inject(EmailService) private emailService: EmailService,

    ) { }

    public async execute(email: string, roleOld : number, roleNew: number): Promise<UserSendEmailResponseDto> {
        try {

            email = email.toLowerCase();

            CheckIsEmailFromAllowedDomains.check(email)

            let roles = {
                1: 'Administrator',
                2: 'Full Funnel Viewer',
                3: 'Commercial viewer'
            }

            const data = {
                from: config.mailgun.mail,
                to: email,
                subject: 'Your role has been changed for TIPA PRO',
                template: 'role_changed',
                'o:tag': 'role_changed',
                'v:role_old': roles[roleOld],
                'v:role_new': roles[roleNew],
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