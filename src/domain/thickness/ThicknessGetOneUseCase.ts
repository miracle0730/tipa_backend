import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ThicknessEntity } from './ThicknessEntity';
import { IThicknessRepository, ThicknessCriteria } from './IThicknessRepository';

@injectable()
export class ThicknessGetOneUseCase implements IUseCase<ThicknessEntity> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ThicknessRepository) private repo: IThicknessRepository
    ) { }

    public async execute(criteria: ThicknessCriteria): Promise<ThicknessEntity> {
        try {
            const thickness = await this.repo.getOne(criteria);

            return thickness;

        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}