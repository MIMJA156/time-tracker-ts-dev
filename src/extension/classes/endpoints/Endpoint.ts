import { Server, WebSocket } from 'ws';
import { StorageUtils } from '../StorageUtils';

export class Endpoint {
	public storageUtils: StorageUtils;
	public wsServer: Server<WebSocket>;

	constructor(storageUtils: StorageUtils, wsServer: Server<WebSocket>) {
		this.storageUtils = storageUtils;
		this.wsServer = wsServer;
	}

	public getValuesFromData(data: string): Object {
		let final = {};
		let splitData = data.split('&');

		for (data of splitData) {
			let newSplitData = data.split('=');
			final[newSplitData[0]] = newSplitData[1];
		}

		return final;
	}

	public sendToEveryone(data: object) {
		this.wsServer.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}
}
