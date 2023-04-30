import { RawData, WebSocket, WebSocketServer } from 'ws';
import { Server, createServer } from 'http';
import express from 'express';
import { Socket } from 'net';
import path from 'path';

const initialWebSocketRequestData = {
	init: true,
	settings: {},
};

export class ServerManager {
	private _port: number;
	private httpServer: Server;
	private connections: Set<Socket>;

	constructor(port: number) {
		this._port = port;
		this.connections = new Set();

		this.httpServer = createServer();
		addExpressServerProperties(this.httpServer);
		addWebSocketProperties(this.httpServer);

		this.httpServer.on('connection', (socket) => {
			this.connections.add(socket);

			this.httpServer.once('close', () => {
				this.connections.delete(socket);
			});
		});
	}

	public start() {
		this.httpServer.listen(this._port);
	}

	public stop() {
		this.httpServer.close(() => {
			console.log('closed!');
		});

		for (const socket of this.connections) {
			socket.destroy();
			this.connections.delete(socket);
		}
	}
}

function addWebSocketProperties(httpServerInstance: Server) {
	let wss = new WebSocketServer({ server: httpServerInstance });

	wss.on('connection', (socket: WebSocket) => {
		socket.send(JSON.stringify(initialWebSocketRequestData));

		socket.on('message', (sentData: RawData, client: WebSocket) => {
			console.log(`Message ${new Date().toLocaleDateString()} -> ${sentData.toString()}`);
		});
	});
}

function addExpressServerProperties(httpServerInstance: Server) {
	let expressApplicationInstance = express();

	expressApplicationInstance.use('/dashboard', express.static(path.join(__dirname, '/web/')));

	httpServerInstance.on('request', expressApplicationInstance);
}
