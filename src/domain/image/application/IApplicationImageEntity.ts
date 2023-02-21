export class ApplicationImageEntity {
    id?: number;
    image: string;
    application_id: number;
    updated_at?: Date;
    created_at?: Date;
}

export type ApplicationImageEntityType = {
    images: string[];
    application_id: number
}