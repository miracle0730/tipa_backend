import { CategoryMetadata } from './CategoryDto';

export enum MainCategoryNames {
    APPLICATION = 'Application',
    PRODUCT_FAMILY = 'Product Family',
    SEGMENTS = 'Segments',
    APPLICATION_TYPE = 'Application type',
    ADDITIONAL_FEATURES = 'Additional features',
    CORE = 'Core',
    COMPOSTABILITY_LOGOS = 'Compostability logos',
    FOOD_CONTACTS = 'Food contacts',
    CERTIFIED_BY = 'Certified By',
    CERTIFICATES = 'Certificates',
    PARTNERS = 'Partners',
    TERRITORIES = 'Territories',
    MEASURE_UNIT = 'Measure Unit',
    PRINTING_METHOD = 'Printing Method',
}

export enum CategoryLevel {
    ROOT = 0,
    MAIN = 1,
    SUB = 2
}

export enum ApplicationCategoryLevel {
    MAIN = 1,
    PACKAGING_REELS = 2,
    APPLICATION = 3,
}

export enum SegmentCategoryLevel {
    MAIN = 1,
    SEGMENT = 2,
    SUB_SEGMENT = 3,
    PACKAGE_GOODS_TYPE = 4
}

export enum FilmGrade {
    FOOD_GRADE = 'Food Grade',
    DRY_FOOD = 'Dry Food',
    NON_FOOD = 'Non Food'
}

export enum CategoryMetadataFileFieldsNames {
    CERTIFICATES = 'certificates',
    APPLICATION_TYPE = 'application-type',
    PRODUCT_FAMILY = 'product-family',
}

export class CategoryEntity {
    id?: number;
    parent_id: number;
    level: CategoryLevel | ApplicationCategoryLevel | SegmentCategoryLevel;
    title: string;
    metadata: CategoryMetadata;
    updated_at?: Date;
    created_at?: Date;
}

export enum CategoryMetadataAvailableFieldNames {
    APPLICATIONS = 1,
    PRODUCTS = 2
}
