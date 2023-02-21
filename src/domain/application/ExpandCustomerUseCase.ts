import { injectable } from 'inversify';
import { IUseCase } from '../IUseCase';
import { config } from '../../infra/config';
import { Customer } from './ApplicationDto';
import { IItemData } from '../product/ExpandDocumentUrlUseCase';

export interface ICustomer {
    images: string[];
    description: string
}

export interface ICustomerImages {
    id: string;
    url: string
}

@injectable()
export class ExpandCustomerUseCase implements IUseCase<Customer> {
    constructor() { }

    public execute(customer: ICustomer, { itemType, elementType }: IItemData): Customer {

        if (!customer) {
            return
        }

        const images = customer.images.map((image): ICustomerImages => {
            return {
                id: image,
                url: `https://${config.s3.bucket}.s3.amazonaws.com/${itemType}/images/${elementType}/${image}`
            };
        });

        return {
            images,
            description: customer.description
        };

    }

}