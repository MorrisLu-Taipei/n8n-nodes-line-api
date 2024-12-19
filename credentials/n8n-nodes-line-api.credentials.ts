import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class LineApiCredentials implements ICredentialType {
  name = 'lineApi';
  displayName = 'LINE API Credentials';
  documentationUrl = 'https://developers.line.biz/en/docs/messaging-api/';
  properties: INodeProperties[] = [
    {
      displayName: 'Channel Access Token',
      name: 'accessToken',
      type: 'string',
      default: '',
      placeholder: 'Your-Access-Token',
      required: true,
    },
  ];
}
