import { inject, injectable } from 'inversify';
import { S3 } from 'aws-sdk';
import { IUseCase } from '../IUseCase';
import { TYPES } from '../../container';
import { ILogger } from '../ILogger';
import { config } from '../../infra/config'
import { PresignUploadDto, PresignUploadRequestDto } from './PresignUploadDto';
import moment = require('moment');
import { ResourceTypeEnum } from './ImageEntity';
import { query } from 'winston';

export interface IPresignUploadQueryParams {
    itemType: string;
    fileType: string;
    elementType?: string;
}

@injectable()
export class PresignUploadUrlUseCase implements IUseCase<PresignUploadDto> {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger
    ) { }

    public async execute(request: PresignUploadRequestDto, queryParams: IPresignUploadQueryParams): Promise<PresignUploadDto> {
        let { itemType, fileType, elementType } = queryParams;
        const allowedExt = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'pdf', 'ai'];
        const allowedFileType = ['image', 'document'];
        const expiresMS = 900000;

        elementType = elementType ? `/${elementType}/` : '/';

        const fileExt = request.fileName.split('.').pop().toLowerCase();
        const prepareFileName = request.fileName.split('.');

        prepareFileName.pop();

        const fileName = prepareFileName.join('.');

        const currentDateTime = moment(new Date()).format('YYYY-MM-DD');

        const key = `${itemType}/${fileType}s${elementType}${fileName}_${currentDateTime}.${fileExt}`;
        if (!allowedFileType.includes(fileType)) {
            throw new Error('File type not supported!')
        }

        if (!allowedExt.includes(fileExt)) {
            throw new Error('File extension not supported!')
        }

        return new Promise((resolve, reject) => {

            const s3 = new S3();

            s3.config.update({
                accessKeyId: config.s3.accessKeyId,
                secretAccessKey: config.s3.secretAccessKey,
                region: config.s3.region
            });
            const expireSeconds = Math.round(expiresMS / 1000);

            let params = {
                Bucket: config.s3.bucket,
                Expires: expireSeconds,
                Fields: {
                    acl: 'public-read',
                    key: key,
                    'Content-Type': request.contentType
                }
            };

            if (itemType === ResourceTypeEnum.CERTIFICATES) {
                params.Fields['Content-Disposition'] = 'attachment;'
            }

            s3.createPresignedPost(params, (err, data: any) => {
                if (err) {
                    this.logger.error('Presigning post data encountered an error', err);
                    return reject(err);
                } else {
                    return resolve(data as PresignUploadDto);
                }
            });
        });
    }
}