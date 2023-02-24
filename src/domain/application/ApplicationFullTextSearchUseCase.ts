import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType } from 'slonik';
import { ApplicationDto } from './ApplicationDto';
import { IApplicationRepository } from './IApplicationRepository';
import { ApplicationMap } from './ApplicationMap';

@injectable()
export class ApplicationFullTextSearchUseCase implements IUseCase<ApplicationDto[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository
    ) { }

    public async execute(query: string, tx?: DatabaseTransactionConnectionType): Promise<ApplicationDto[]> {
        try {

            const applications = await this.repo.search(query)

            return applications.map(ApplicationMap.toDto);

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}