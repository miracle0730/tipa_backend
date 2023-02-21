import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, UniqueIntegrityConstraintViolationError, InvalidInputError, SlonikError } from 'slonik';
import { IApplicationRepository } from './IApplicationRepository';

import { HttpError } from 'routing-controllers';

@injectable()
export class ApplicationDraftUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ApplicationRepository) private repo: IApplicationRepository,
    ) { }

    public async execute(productIds: number[], tx?: DatabaseTransactionConnectionType): Promise<void> {
        try {

            await this.repo.update({ product: productIds }, { draft: true });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The Applications has not been updated!')
            }

            throw err;
        }
    }
}