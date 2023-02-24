import { inject, injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { ThicknessEntity } from './ThicknessEntity';
import { IThicknessRepository } from './IThicknessRepository';
import _ = require('lodash');

@injectable()
export class ThicknessGetAllUseCase implements IUseCase<ThicknessEntity[]> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.ThicknessRepository) private repo: IThicknessRepository
    ) { }

    public async execute(): Promise<ThicknessEntity[]> {
        try {

            return await this.repo.getAll();

        } catch (err) {
            this.logger.error(err);
            throw err;
        }

    }

}