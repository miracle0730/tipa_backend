import { inject, injectable } from 'inversify';
import { IUseCase } from '../../domain/IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../../domain/ILogger';
import { SettingsEntity } from './SettingsEntity';
import { ISettingsRepository, SettingsCriteria } from './ISettingsRepository';

@injectable()
export class SettingsGetOneUseCase implements IUseCase<SettingsEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.SettingsRepository) private repo: ISettingsRepository
    ) { }

    public async execute(criteria: SettingsCriteria): Promise<SettingsEntity> {
        try {
            const settings = await this.repo.getOne(criteria);

            return settings;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}