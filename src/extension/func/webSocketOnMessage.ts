import WebSocket, { Server as WebSocketServerType, WebSocketServer, RawData } from 'ws';

export function WebSocketOnMessage(data: RawData, client: WebSocket) {
	console.log(data.toString());
}
