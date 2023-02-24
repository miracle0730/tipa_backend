import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { IApplicationRepository } from './IApplicationRepository';
import { SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class ApplicationRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(id: number): Promise<void> {
        try {

            await this.repo.remove(id);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The Application has not been removed!')
            }

            throw err;
        }
    }
}