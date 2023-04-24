import WebSocket, { RawData } from 'ws';

export function WebSocketOnMessage(data: RawData, client: WebSocket) {
	console.log(`Message ${new Date().toLocaleDateString()} -> ${data.toString()}`);
}
