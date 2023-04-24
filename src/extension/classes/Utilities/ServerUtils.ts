import { Server, createServer } from 'http';
import express from 'express';
import { Express } from 'express-serve-static-core';
import { WebSocketServer as NpmWebSocketServer, WebSocket as NpmWebSocket } from 'ws';

export class ServerManager {
	_httpServer: Server;

	constructor(private port: number) {
		let httpServerInstance = createServer();

		new ExpressServer(httpServerInstance);
		new WebSocketServer(httpServerInstance);

		this._httpServer = httpServerInstance;
	}

	start() {
		this._httpServer.listen(this.port);
	}
}

class ExpressServer {
	expressApplicationInstance: Express;

	constructor(httpServer: Server) {
		this.expressApplicationInstance = express();
		this.defineEndpoints(this.expressApplicationInstance);

		httpServer.on('request', this.expressApplicationInstance);
	}

	private defineEndpoints(instance: Express) {
		instance.get('/foo', (req, res) => {
			res.send('Hello World!');
		});
	}
}

class WebSocketServer {
	constructor(httpServer: Server) {
		const wss = new NpmWebSocketServer({ server: httpServer });

		wss.on('connection', (connection) => {
			this.onConnection(connection);
		});
	}

	private onConnection(connection: NpmWebSocket) {
		connection.send('hello world...');
	}
}
