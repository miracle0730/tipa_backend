import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ApplicationEntity } from './ApplicationEntity';
import { IApplicationRepository } from './IApplicationRepository';

@injectable()
export class ApplicationGetAllUseCase implements IUseCase<ApplicationEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(application: number, segment: number): Promise<ApplicationEntity[]> {
        try {

            return await this.repo.getAll(application, segment);

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}