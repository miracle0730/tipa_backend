import {Certification, PrintingMethod, Thickness, Collaterals} from '../product/ProductDto';
import { DisplayPriority, LevelOfClearance, Stage } from '../product/ProductEntity';
import { AdditionalFeatures, Certificate, Certificatespecdoc, Dieline, FastTrack, MarketingDoc, Size, Stream, TechnicalConsiderations } from './ApplicationDto';
import { IAvailableMarketingSamples } from './ExpandAvailableMarketingSamplesUseCase';
import { ICustomer } from './ExpandCustomerUseCase';

export class ApplicationEntity {
    id?: number;
    type: number;
    stage: Stage;
    description?: string;
    images: string[]; // urls
    application: number[];
    segment: number[];
    segment_type: number[];
    packed_goods: number[];
    product: number[];
    thickness?: Thickness[];
    width?: Size[];
    height?: Size[];
    production_process?: string;
    tipa_production_site?: string;
    technical_considerations?: TechnicalConsiderations;
    features?: string;
    positive_experiments?: string;
    negative_feedback_to_be_aware_of?: string;
    dieline?: Dieline;
    customers?: ICustomer[];
    available_marketing_samples?: IAvailableMarketingSamples[];
    draft?: boolean;
    additional_features: AdditionalFeatures[];
    terms_and_limitations: string;
    display_priority?: DisplayPriority;
    rtf?: string;
    certifications?: Certification[];
    marketing_doc?: MarketingDoc[];
    certificatespecdoc?: Certificatespecdoc[];
    collaterals?: Collaterals[];
    streams?: Stream[];
    fast_track?: FastTrack;
    level_of_clearance?: LevelOfClearance;
    certificates?: Certificate[];
    updated_at?: Date;
    created_at?: Date;

    printing_method?: PrintingMethod[];
    partner_name?: number[];
    production_site?: string;
    notes_area?:string;
}
