export class ProductImageEntity {
    id?: number;
    image: string;
    product_id: number;
    updated_at?: Date;
    created_at?: Date;
}

export type ProductImageEntityType = {
    images: string[];
    product_id: number
}