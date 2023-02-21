import { injectable } from 'inversify';
import { Client, ClientOptions } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { ClientCredentialAuthenticationProvider } from '../calculator/ClientCredentialAuthenticationProvider';
import { CalculatorParams, CalculatorResponse, CalculatorValue } from '../calculator/CalculatorEntity';
import { config } from '../../infra/config';

@injectable()
export class MicrosoftOfficeClientService {

    private provider: Client;

    constructor() {
        this.provider = Client.initWithMiddleware({
            defaultVersion: 'v1.0',
            debugLogging: false,
            authProvider: new ClientCredentialAuthenticationProvider()
        } as ClientOptions);
    }

    private createAuthenticatedClient(): Client {
        return this.provider;
    }

    public async getDocuments(): Promise<CalculatorResponse> {
        return await this.createAuthenticatedClient()
            .api(`/users/${config.microsoftOffice.user_id}/drive/root/children`)
            .get();
    }

    public async getSheets(params: CalculatorParams): Promise<CalculatorResponse> {
        return await this.createAuthenticatedClient()
            .api(`/users/${config.microsoftOffice.user_id}/drive/items/${params.document_id}/workbook/worksheets`)
            .get();
    }

    public async updateCells(params: CalculatorParams, { values }: CalculatorValue): Promise<CalculatorResponse> {
        return await this.createAuthenticatedClient()
            .api(`/users/${config.microsoftOffice.user_id}/drive/items/${params.document_id}/workbook/worksheets/${params.sheet_id}/range(address='${params.cells}')`)
            .patch({ values: values.map(value => [value]) });
    }

    public async getCell(params: CalculatorParams): Promise<CalculatorResponse> {
        return await this.createAuthenticatedClient()
            .api(`/users/${config.microsoftOffice.user_id}/drive/items/${params.document_id}/workbook/worksheets/${params.sheet_id}/range(address='${params.cells}')`)
            .get();
    }

    public async getCells(params: CalculatorParams): Promise<CalculatorResponse> {
        return await this.createAuthenticatedClient()
            .api(`/users/${config.microsoftOffice.user_id}/drive/items/${params.document_id}/workbook/worksheets/${params.sheet_id}/range(address='${params.cells}')`)
            .get();
    }
}