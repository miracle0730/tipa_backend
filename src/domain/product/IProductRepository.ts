import { IRepository } from '../IRepository';
import { ProductEntity } from './ProductEntity';

export interface IProductRepository extends IRepository<ProductEntity> {
    getAll(...params: any): Promise<ProductEntity[]>;
    search(...params: any): Promise<ProductEntity[]>;
    getByCategories(...params: any): Promise<ProductEntity[]>;
    getAllByCertificateId(...params: any): Promise<ProductEntity[]>;
}