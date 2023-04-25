import path from 'path';
import express from 'express';
import { Server, createServer } from 'http';
import { Express } from 'express-serve-static-core';
import { WebSocketServer as NpmWebSocketServer, WebSocket as NpmWebSocket, RawData } from 'ws';

export class ServerManager {
	httpServer: Server;

	_expressServer: ExpressServer;
	_webSocketServer: WebSocketServer;

	constructor(private port: number) {
		let httpServerInstance = createServer();

		this._expressServer = new ExpressServer(httpServerInstance);
		this._webSocketServer = new WebSocketServer(httpServerInstance);

		this.httpServer = httpServerInstance;
	}

	public start() {
		this.httpServer.listen(this.port);
	}

	public stop() {
		this.httpServer.close(() => {
			console.log('Closed out http server.');
		});

		this._webSocketServer.stop();
		this._expressServer.stop();
	}
}

class ExpressServer {
	connectionList: any[];
	expressApplicationInstance: Express;

	constructor(httpServer: Server) {
		this.expressApplicationInstance = express();
		this.defineEndpoints(this.expressApplicationInstance);

		httpServer.on('request', this.expressApplicationInstance);
	}

	private defineEndpoints(instance: Express) {
		instance.use('/dashboard', express.static(path.join(__dirname, '/web/')));
	}

	public stop() {
		this.connectionList.forEach((curr) => curr.end());
		setTimeout(() => this.connectionList.forEach((curr) => curr.destroy()), 5000);
	}
}

class WebSocketServer {
	connectionsList: NpmWebSocket[];
	_wss: any;

	constructor(httpServer: Server) {
		this._wss = new NpmWebSocketServer({ server: httpServer });

		this._wss.on('connection', (connection: NpmWebSocket) => {
			this.onConnection(connection);
		});
	}

	private onConnection(socket: NpmWebSocket) {
		let data = {
			too: 'web',
			from: 'server',
			init: true,
			settings: {},
			time: {},
		};

		socket.send(JSON.stringify(data));

		socket.on('message', this.onMessage);
		socket.on('close', this.onDisconnect);
		this.connectionsList.push(socket);
	}

	private onMessage(data: RawData, client: NpmWebSocket) {
		console.log(`Message ${new Date().toLocaleDateString()} -> ${data.toString()}`);
	}

	private onDisconnect(socket: NpmWebSocket) {
		this.connectionsList = this.connectionsList.filter((current) => current !== socket);
	}

	public stop() {
		for (const client of this._wss.clients) {
			client.close();
		}
	}
}
