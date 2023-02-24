import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { IThicknessRepository } from './IThicknessRepository';
import { SlonikError } from 'slonik';
import { HttpError } from 'routing-controllers';

@injectable()
export class ThicknessRemoveUseCase implements IUseCase<void> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ThicknessRepository) private repo: IThicknessRepository

    ) { }

    public async execute(id: number): Promise<void> {
        try {

            await this.repo.remove(id);

        } catch (err) {
            this.logger.error(err);

            if (err instanceof SlonikError) {
                throw new HttpError(400, 'The thickness has not been deleted!')
            }

            throw err;
        }

    }

}