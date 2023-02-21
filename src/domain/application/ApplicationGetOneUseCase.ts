import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ApplicationEntity } from './ApplicationEntity';
import { IApplicationRepository } from './IApplicationRepository';

@injectable()
export class ApplicationGetOneUseCase implements IUseCase<ApplicationEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(id: number): Promise<ApplicationEntity> {
        try {
            const application = await this.repo.getOne(id);

            return application;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}