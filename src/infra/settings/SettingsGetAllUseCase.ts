import { inject, injectable } from 'inversify';
import { IUseCase } from '../../domain/IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../../domain/ILogger';
import { SettingsEntity } from './SettingsEntity';
import { ISettingsRepository } from './ISettingsRepository';
import _ = require('lodash');

@injectable()
export class SettingsGetAllUseCase implements IUseCase<SettingsEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.SettingsRepository) private repo: ISettingsRepository
    ) { }

    public async execute(): Promise<SettingsEntity[]> {
        try {

            return await this.repo.getAll();

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}