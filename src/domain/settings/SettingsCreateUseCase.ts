import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, SlonikError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { HttpError } from 'routing-controllers';
import { SettingsEntity } from './SettingsEntity';
import { ISettingsRepository } from './ISettingsRepository';
import { SettingsCreateDto } from './SettingsDto';
import { SettingsMap } from './SettingsMap';
import { SettingsGetOneUseCase } from './SettingsGetOneUseCase';

@injectable()
export class SettingsCreateUseCase implements IUseCase<SettingsEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.SettingsRepository) private repo: ISettingsRepository,
        @inject(SettingsGetOneUseCase) private settingsGetOneUseCase: IUseCase<SettingsEntity>

    ) { }

    public async execute(dto: SettingsCreateDto, tx?: DatabaseTransactionConnectionType): Promise<SettingsEntity> {
        try {
            const settingsEntity = SettingsMap.toDomain(dto);

            const settingsId = await this.repo.create(settingsEntity, tx);

            return await this.settingsGetOneUseCase.execute({ id: settingsId });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Settings must have a unique value!');
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The settings has not been created!')
            }

            throw err;
        }

    }

}