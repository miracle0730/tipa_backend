// import * as _ from 'lodash';
// import * as perfy from 'perfy';
// import * as uuidv1 from 'uuid';
// import { inject, injectable } from 'inversify';
// import { ILogger } from '../../../domain/ILogger';
// import { TYPES } from '../../../container';

// import { Middleware, KoaMiddlewareInterface, NotFoundError } from 'routing-controllers';
// import { RequestState } from '../RequestState';
// import { ICustomerRepository } from '../../../domain/customer/ICustomerRepository';

// @injectable()
// @Middleware({ type: 'before' })
// export class PermissionMiddleware implements KoaMiddlewareInterface {
//     @inject(TYPES.CustomerRepository) private customerRepository: ICustomerRepository;
//     @inject(TYPES.Logger) private logger: ILogger;
//     @inject(RequestState) private state: RequestState;

//     async use(ctx: any, next: (err: any) => Promise<any>): Promise<any> {
//         // console.info('PermissionMiddleware', JSON.stringify(ctx.request.params, null, 2));

//         // let customerId = ctx.params.customerId;
//         // if (customerId) {
//         //     let customer = await this.customerRepository.getById(customerId);
//         //     if (!customer) throw new NotFoundError();
//         // }

//         await next(ctx);
//     }

// }