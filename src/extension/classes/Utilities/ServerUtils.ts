import path from 'path';
import express from 'express';
import { Server, createServer } from 'http';
import { Express } from 'express-serve-static-core';
import { getInitialData, onMessage } from '../../func/webSocketOn';
import { WebSocketServer as NpmWebSocketServer, WebSocket as NpmWebSocket } from 'ws';

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

		instance.get('/foo', (req, res) => {
			res.send('Hello World!');
		});
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

		this._wss.on('connection', (connection) => {
			this.onConnection(connection);
		});
	}

	private onConnection(socket: NpmWebSocket) {
		socket.send(getInitialData());
		socket.on('message', onMessage);
		socket.on('close', this.onDisconnect);
		this.connectionsList.push(socket);
	}

	private onDisconnect(socket: NpmWebSocket) {
		this.connectionsList = this.connectionsList.filter((current) => current !== socket);
	}

	public stop() {
		this._wss.close();
		for (const client of this._wss.clients) {
			client.close();
		}
	}
}
