import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { FastTrack } from './ApplicationDto';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

@injectable()
export class ExpandFastTrackUseCase implements IUseCase<FastTrack> {
    constructor() { }

    public execute(fast_track: FastTrack, { itemType, elementType }: IItemData): FastTrack {

        if (!fast_track) {
            return {
                application_number: null,
                thickness: [],
                additional_features: [],
                production_site: null,
                number_of_printing_colors: null,
                dimensions: [],
                items: []
            }
        }

        const { application_number,
            thickness,
            additional_features,
            production_site,
            number_of_printing_colors,
            dimensions,
            items } = fast_track;

        return {
            application_number: application_number || null,
            thickness: thickness?.map(single_thickness => {
                return {
                    stage: single_thickness.stage || null,
                    values: single_thickness.values?.map(value => value) || []
                }
            }) || [],
            additional_features: additional_features?.map(additional_feature => {
                return {
                    ids: additional_feature.ids?.map(id => id) || [],
                    stage: additional_feature?.stage || null,
                    mandatory: additional_feature?.mandatory || false
                }
            }) || [],
            production_site: production_site || null,
            number_of_printing_colors: number_of_printing_colors?.map(number_of_color => number_of_color) || [],
            dimensions: dimensions?.map(dimension => {
                return {
                    size: dimension.size || null,
                    width: dimension.width || null,
                    height: dimension.height || null,
                    flap: dimension.flap || null,
                    gusset: dimension.gusset || null,
                    dieline_url: itemType && dimension.dieline_url ? `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${dimension.dieline_url}` : dimension.dieline_url || null
                }
            }) || [],
            items: items?.map(item => {
                return {
                    visible: item.visible || false,
                    code: item.code || null,
                    dimension: item.dimension ? {
                        size: item.dimension.size || null,
                        width: item.dimension.width || null,
                        height: item.dimension.height || null,
                        flap: item.dimension.flap || null,
                        gusset: item.dimension.gusset || null,
                        dieline_url: itemType && item.dimension.dieline_url ? `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/documents/${elementType}/${item.dimension.dieline_url}` : item.dimension.dieline_url || null
                    } : null,
                    thickness: item.thickness || null,
                    color: item.color || null,
                    moq: item.moq || null,
                }
            }) || []
        }
    }

}