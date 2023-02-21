import * as mailgun from 'mailgun-js';
import { injectable } from 'inversify';
import { config } from '../../infra/config';


@injectable()
export class EmailService {

    private provider;

    constructor() {
        this.provider = mailgun({
            apiKey: config.mailgun.privateApiKey,
            domain: config.mailgun.domain,
            host: config.mailgun.host
        });
    }

    public async send(data: object): Promise<void> {
        this.provider.messages().send(data);
    }

}