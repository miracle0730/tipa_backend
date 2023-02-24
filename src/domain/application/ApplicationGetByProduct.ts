import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ApplicationEntity } from './ApplicationEntity';
import { IApplicationRepository } from './IApplicationRepository';

@injectable()
export class ApplicationGetByProductUseCase implements IUseCase<ApplicationEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(product_id: number): Promise<ApplicationEntity[]> {
        try {
            const applications = await this.repo.getAllByProduct(product_id);

            return applications;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}