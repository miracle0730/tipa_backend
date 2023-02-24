import { injectable, inject } from 'inversify';

@injectable()
export class RequestState {
    private _requestId: string;
    constructor() { }

    get requestId(): string {
        return this._requestId;
    }

    set requestId(value: string) {
        this._requestId = value;
    }

}