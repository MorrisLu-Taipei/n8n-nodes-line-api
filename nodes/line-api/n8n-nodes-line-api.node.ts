import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import axios from 'axios';

export class LineApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'LINE API',
    name: 'lineApi',
    group: ['transform'],
    version: 1,
    description: 'Send messages using LINE API',
    defaults: {
      name: 'LINE API',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'lineApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Message Type',
        name: 'messageType',
        type: 'options',
        options: [
          { name: 'Broadcast', value: 'broadcast' },
          { name: 'Reply', value: 'reply' },
        ],
        default: 'broadcast',
        description: 'Choose the type of message to send.',
      },
      {
        displayName: 'Message Text',
        name: 'messageText',
        type: 'string',
        default: '',
        placeholder: 'Enter your message here',
      },
      {
        displayName: 'Reply Token',
        name: 'replyToken',
        type: 'string',
        default: '',
        placeholder: 'Enter the reply token (for Reply type)',
        displayOptions: {
          show: { messageType: ['reply'] },
        },
      },
      {
        displayName: '創建作者: Tiger AI Taiwan Team',
        name: 'authorInfo',
        type: 'notice',
        default: '',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const credentials = await this.getCredentials('lineApi');
    const messageType = this.getNodeParameter('messageType', 0) as string;
    const messageText = this.getNodeParameter('messageText', 0) as string;
    const replyToken = this.getNodeParameter('replyToken', 0, '') as string;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.accessToken}`,
    };

    let url = '';
    let data = {};

    if (messageType === 'broadcast') {
      url = 'https://api.line.me/v2/bot/message/broadcast';
      data = {
        messages: [{ type: 'text', text: messageText }],
      };
    } else if (messageType === 'reply') {
      url = 'https://api.line.me/v2/bot/message/reply';
      data = {
        replyToken,
        messages: [{ type: 'text', text: messageText }],
      };
    }

    try {
      await axios.post(url, data, { headers });
      return this.helpers.returnJsonArray({ success: true });
    } catch (error) {
      throw new Error(`LINE API Error: ${error.message}`);
    }
  }
}
