import WebSocket, { Server as WebSocketServerType, WebSocketServer, RawData } from 'ws';

export function WebSocketOnMessage(data: RawData, client: WebSocket) {
	client.send(
		JSON.stringify({
			type: 'initial',
			data: {
				test: 'This is random data that does not matter!',
			},
		}),
	);
}
