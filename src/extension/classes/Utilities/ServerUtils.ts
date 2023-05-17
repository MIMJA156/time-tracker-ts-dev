import { RawData, WebSocket, WebSocketServer } from 'ws';
import { StorageUtils } from './StorageUtils';
import { Server, createServer } from 'http';
import express from 'express';
import { Socket } from 'net';
import path from 'path';
import cors from 'cors';

export class ServerManager {
	private _port: number;
	private httpServer: Server;
	private connections: Set<Socket>;
	private _storageUtils: StorageUtils;

	constructor(port: number, storageUtils: StorageUtils) {
		this._port = port;
		this.connections = new Set();
		this._storageUtils = storageUtils;

		this.httpServer = createServer();
		this.addExpressServerProperties();
		this.addWebSocketProperties();

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
		this.httpServer.close();

		for (const socket of this.connections) {
			socket.destroy();
			this.connections.delete(socket);
		}
	}

	private addWebSocketProperties() {
		let wss = new WebSocketServer({ server: this.httpServer });

		wss.on('connection', (socket: WebSocket) => {
			socket.send('initial data');

			socket.on('message', (sentData: RawData, client: WebSocket) => {
				console.log(`Message ${new Date().toLocaleDateString()} -> ${sentData.toString()}`);
			});
		});
	}

	private addExpressServerProperties() {
		let expressApplicationInstance = express();

		expressApplicationInstance.use(cors());
		expressApplicationInstance.use('/dashboard', express.static(path.join(__dirname, '/web/')));

		expressApplicationInstance.get('/api/get/current-time-object', (req, res) => {
			res.json(this._storageUtils.getLocalStoredTime());
		});

		this.httpServer.on('request', expressApplicationInstance);
	}
}
