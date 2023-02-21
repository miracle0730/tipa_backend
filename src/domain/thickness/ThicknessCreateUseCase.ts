import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { DatabaseTransactionConnectionType, SlonikError, UniqueIntegrityConstraintViolationError } from 'slonik';
import { HttpError } from 'routing-controllers';
import { ThicknessEntity } from './ThicknessEntity';
import { IThicknessRepository } from './IThicknessRepository';
import { ThicknessCreateDto } from './ThicknessDto';
import { ThicknessMap } from './ThicknessMap';
import { ThicknessGetOneUseCase } from './ThicknessGetOneUseCase';

@injectable()
export class ThicknessCreateUseCase implements IUseCase<ThicknessEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ThicknessRepository) private repo: IThicknessRepository,
        @inject(ThicknessGetOneUseCase) private thicknessGetOneUseCase: IUseCase<ThicknessEntity>

    ) { }

    public async execute(dto: ThicknessCreateDto, tx?: DatabaseTransactionConnectionType): Promise<ThicknessEntity> {
        try {
            const thicknessEntity = ThicknessMap.toDomain(dto);

            const thicknessId = await this.repo.create(thicknessEntity, tx);

            return await this.thicknessGetOneUseCase.execute({ id: thicknessId });

        } catch (err) {
            this.logger.error(err);

            if (err instanceof UniqueIntegrityConstraintViolationError) {
                throw new HttpError(400, 'Thickness must have a unique value!');
            }

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The thickness has not been created!')
            }

            throw err;
        }

    }

}