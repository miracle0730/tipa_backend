import { HttpError } from 'routing-controllers';
import { config } from '../../infra/config';

export class CheckIsEmailFromAllowedDomains {
    constructor() { }

    static check(email: string): void {
        const allowedDomains = config.corpEmailDomain.split(',');

        if (!allowedDomains.includes(`@${email.split('@').pop()}`)) {
            throw new HttpError(400, 'Sorry, you can not do this with that email address. Please use your TIPA email address.');
        }
    }

}