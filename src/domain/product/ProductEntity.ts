import {AdditionalFeatures, Certificate, TechnicalConsiderations} from '../application/ApplicationDto';
import {
    AvailableTerritories,
    Barrier,
    Certification,
    Collaterals,
    MoqMethod,
    Msds,
    Printability, PrintingMethod,
    SizeProduct,
    Tds,
    Thickness
} from './ProductDto';

export enum Stage {
    COMMERCIAL = 1,
    UNDER_DEVELOPMENT = 2,
    FUTURE_DEVELOPMENT = 3,
    PARTNERS = 4
}

export enum LevelOfClearance {
    ADMIN_LEVEL_ONLY = 3,
    PUBLIC_TO_ALL = 1,
    VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR = 2
}

export enum DisplayPriority {
    PRIORITY1 = 1,
    PRIORITY2 = 2,
    PRIORITY3 = 3,
    PRIORITY4 = 4,
    PRIORITY5 = 5,
    PRIORITY6 = 6,
    PRIORITY7 = 7,
    PRIORITY8 = 8,
    PRIORITY9 = 9,
    PRIORITY10 = 10,
}

export enum ManufacturingTechnique {
    CAST = 1,
    BLOWN = 2
}

export class ProductEntity {
    id?: number;
    title: string;
    stage: Stage;
    description?: string;
    images: string[]; // urls
    family: number[];
    segment?: number[];
    segment_type?: number[];
    thickness?: Thickness[];
    width?: SizeProduct[];
    features?: string;
    technical_considerations?: TechnicalConsiderations;
    tds?: Tds[];
    msds?: Msds[];
    collaterals?: Collaterals[];
    certifications?: Certification[];
    draft?: boolean;
    terms_and_limitations: string;
    manufacturing_technique?: ManufacturingTechnique;
    application: number[];
    display_priority?: DisplayPriority;
    barrier?: Barrier;
    printability?: Printability;
    rtf?: string;
    printing_stage?: Stage;
    packed_goods: number[];
    additional_features: AdditionalFeatures[];
    level_of_clearance: LevelOfClearance;
    certificates?: Certificate[];
    updated_at?: Date;
    created_at?: Date;

    printing_method?: PrintingMethod[];
    available_territories?: AvailableTerritories[];
    moq?: MoqMethod[];
    partner_name?: number[];
    production_site?: string;
    notes_area?:string;
}


export const StageList = [
    {
        id: Stage.COMMERCIAL,
        title: 'Commercial',
        level: 1
    },
    {
        id: Stage.UNDER_DEVELOPMENT,
        title: 'Under development',
        level: 2
    },
    {
        id: Stage.FUTURE_DEVELOPMENT,
        title: 'Future development',
        level: 3
    }
]

export const LevelOfClearanceList = [
    {
        id: LevelOfClearance.PUBLIC_TO_ALL,
        title: 'Public to all',
        level: 1
    },
    {
        id: LevelOfClearance.VISIBLE_IN_PRO_ONLY_ADMIN_IN_GENERATOR,
        title: 'Visible in Pro, only Admin in generator',
        level: 2
    },
    {
        id: LevelOfClearance.ADMIN_LEVEL_ONLY,
        title: 'Admin level only',
        level: 3
    },
]