import WebSocket, { Server as WebSocketServerType, WebSocketServer, RawData } from 'ws';
import { Server as HTTPServerType } from 'http';
import express from 'express';
import { Socket } from 'net';
import path from 'path';
import cors from 'cors';
import open from 'open';
import url from 'url';
import { WebSocketOnMessage } from '../../func/webSocketOnMessage';

export class WebServiceManager {
	_port: number;
	_expressServer: express.Application;
	_httpServer: HTTPServerType;
	_httpConnections: Socket[];
	_wsServer: WebSocketServerType;
	_webSocketServerManager: WebSocketServerManager;

	constructor(port: number) {
		this._port = port;
		this._expressServer = express();
		this._expressServer.use(cors());

		this._wsServer = new WebSocketServer({ noServer: true });

		this.defineEndpoints();
	}

	defineEndpoints() {
		this._expressServer.use('/dashboard', express.static(path.join(__dirname, '/web/')));
	}

	start() {
		this._httpServer = this._expressServer.listen(this._port);

		this._httpServer.on('connection', (connection) => {
			this._httpConnections.push(connection);
			connection.on('close', () => (this._httpConnections = this._httpConnections.filter((curr) => curr !== connection)));
		});

		this._httpServer.on('upgrade', (request, socket, head) => {
			const { pathname } = url.parse(request.url!);

			if (pathname === '/api/sockets') {
				this._wsServer.handleUpgrade(request, socket, head, (socket) => {
					this._wsServer.emit('connection', socket, request);
				});
			} else {
				socket.destroy();
			}
		});

		this._webSocketServerManager = new WebSocketServerManager(this._wsServer);
	}

	stop() {
		this._webSocketServerManager.close();

		this._httpServer.close(() => {
			console.log('Closed out remaining connections - dashboard');
		});

		this._httpConnections.forEach((curr) => curr.end());
		setTimeout(() => this._httpConnections.forEach((curr) => curr.destroy()), 5000);
	}

	openInBrowser() {
		open(`http://localhost:${this._port}/dashboard`);
	}
}

class WebSocketServerManager {
	_wss: WebSocket.Server<WebSocket.WebSocket>;

	constructor(webSocketServer: WebSocket.Server<WebSocket.WebSocket>) {
		webSocketServer.on('connection', (client: WebSocket) => {
			client.on('message', WebSocketOnMessage);
		});

		this._wss = webSocketServer;
	}

	close() {
		this._wss.close(() => {
			console.log('Closed out remaining connections - web sockets');
		});

		for (const client of this._wss.clients) {
			client.close();
		}
	}

	private broadcast(message: string) {
		this._wss.clients.forEach((client: { send: (arg0: string) => void }) => {
			client.send(message);
		});
	}
}
