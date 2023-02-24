import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ISettingsRepository } from './ISettingsRepository';
import { SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class SettingsRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.SettingsRepository) private repo: ISettingsRepository

    ) { }

    public async execute(id: number): Promise<void> {
        try {

            await this.repo.remove(id);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The settings has not been deleted!')
            }

            throw err;
        }

    }

}