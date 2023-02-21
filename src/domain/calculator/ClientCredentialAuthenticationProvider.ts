import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import * as qs from 'qs';
import axios from 'axios';
import { HttpError } from 'routing-controllers';
import { config } from '../../infra/config';

export class ClientCredentialAuthenticationProvider implements AuthenticationProvider {

	public async getAccessToken(): Promise<string> {

		const token_endpoint: string = `https://login.microsoftonline.com/${config.microsoftOffice.tenant_id}/oauth2/v2.0/token`;

		const body: object = {
			client_id: config.microsoftOffice.app_id,
			client_secret: config.microsoftOffice.app_secret,
			scope: config.microsoftOffice.graph_scope_url,
			grant_type: 'client_credentials'
		}

		try {
			let response = await axios.post(token_endpoint, qs.stringify(body))

			if (response.status === 200) {

				return response.data.access_token;
			} else {
				throw new HttpError(400, 'non 200OK response on obtaining token...')
			}

		} catch (err) {
			throw new HttpError(400, 'Microsoft graph error')
		}

	}
}