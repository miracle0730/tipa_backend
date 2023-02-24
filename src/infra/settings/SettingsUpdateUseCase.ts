import { inject, injectable } from 'inversify';
import { IUseCase } from '../../domain/IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../../domain/ILogger';
import { DatabaseTransactionConnectionType, SlonikError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { HttpError } from 'routing-controllers';
import { SettingsEntity } from './SettingsEntity';
import { ISettingsRepository } from './ISettingsRepository';
import { SettingsUpdateDto } from './SettingsDto';
import { SettingsMap } from './SettingsMap';
import { SettingsGetOneUseCase } from './SettingsGetOneUseCase';

@injectable()
export class SettingsUpdateUseCase implements IUseCase<SettingsEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.SettingsRepository) private repo: ISettingsRepository,
        @inject(SettingsGetOneUseCase) private settingsGetOneUseCase: IUseCase<SettingsEntity>
    ) { }

    public async execute(dto: SettingsUpdateDto, id: number, tx?: DatabaseTransactionConnectionType): Promise<SettingsEntity> {
        try {
            const { value } = SettingsMap.toDomain(dto);

            const settingsToUpdate = await this.repo.getOne({ id });

            if (!settingsToUpdate) {
                throw new HttpError(400, 'Settings does not exist!');
            }

            await this.repo.update({ id }, { value }, tx);

            return await this.settingsGetOneUseCase.execute({ id });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Settings must have a unique value!');
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The settings has not been updated!')
            }

            throw err;
        }

    }

}