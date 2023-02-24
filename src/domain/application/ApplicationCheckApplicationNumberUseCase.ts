import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { SlonikError } from 'slonik';
import { IApplicationRepository } from './IApplicationRepository';
import { ApplicationNumberAvailabilityDto } from './ApplicationDto';
import { HttpError } from 'routing-controllers';


@injectable()
export class ApplicationCheckApplicationNumberUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(dto: ApplicationNumberAvailabilityDto): Promise<void> {
        try {

            const { application_number } = dto;

            if (!application_number?.match(/^(?!00)[0-9]{2}[:.,-]?$/g)) {
                throw new HttpError(400, 'Application number is incorrect');
            }

            const applications = await this.repo.getByApplicationNumber(application_number);
            let  is_valid : boolean = false;
            for (const application of applications) {
                if (application && application.id === dto?.application_id) {
                    is_valid = true;
                }
            }
            if (!is_valid)
                throw new HttpError(400, 'This Application number is not available!');

            return;

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'Cannot get application by application number')
            }

            throw err;
        }

    }


}