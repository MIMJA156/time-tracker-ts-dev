import { Server, createServer } from 'http';
import express from 'express';
import { Express } from 'express-serve-static-core';
import { WebSocketServer as NpmWebSocketServer, WebSocket as NpmWebSocket } from 'ws';
import path from 'path';

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
		this._expressServer.stop();
		this._webSocketServer.stop();
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
		const wss = new NpmWebSocketServer({ server: httpServer });

		wss.on('connection', (connection) => {
			this.onConnection(connection);
		});

		this._wss = wss;
	}

	private onConnection(socket: NpmWebSocket) {
		socket.send('Hello World!');

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
