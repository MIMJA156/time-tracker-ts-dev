import { RawData, WebSocket, WebSocketServer } from 'ws';
import { StorageUtils } from './StorageUtils';
import { Server, createServer } from 'http';
import express from 'express';
import { Socket } from 'net';
import path from 'path';
import cors from 'cors';

export class ServerManager {
	private started: boolean;
	private _port: Number;
	private httpServer: Server;
	private connections: Set<Socket>;
	private _storageUtils: StorageUtils;

	private wss: WebSocketServer;

	constructor(port: Number, storageUtils: StorageUtils) {
		this._port = port;
		this.connections = new Set();
		this._storageUtils = storageUtils;

		this.httpServer = createServer();
		this.addExpressServerProperties();
		this.addWebSocketProperties();

		this.httpServer.on('connection', (socket) => {
			this.connections.add(socket);

			socket.once('close', () => {
				this.connections.delete(socket);
			});
		});
	}

	public start() {
		this.started = true;
		this.httpServer.listen(this._port);
	}

	public stop() {
		this.started = false;
		this.httpServer.close();

		for (const socket of this.connections) {
			socket.destroy();
			this.connections.delete(socket);
		}
	}

	public signal(message: String) {
		if (!this.started) return;

		let data = {};

		if (message == 'UPDATE') {
			data = this.getTimeDataForSending();
		}

		this.wss.clients.forEach((client) => {
			client.send(JSON.stringify(data));
		});
	}

	private addWebSocketProperties() {
		let wss = new WebSocketServer({ server: this.httpServer });

		wss.on('connection', (socket: WebSocket) => {
			socket.send(JSON.stringify(this.getTimeDataForSending()));

			socket.on('message', (sentData: RawData) => {
				console.log(`Message ${new Date().toLocaleDateString()} -> ${sentData.toString()}`);
			});
		});

		this.wss = wss;
	}

	private addExpressServerProperties() {
		let expressApplicationInstance = express();

		expressApplicationInstance.use(cors());
		expressApplicationInstance.use('/dashboard', express.static(path.join(__dirname, '/web/')));

		expressApplicationInstance.get('/api/get/current-time-object', (req, res) => {
			res.json(this.getTimeDataForSending());
		});

		this.httpServer.on('request', expressApplicationInstance);
	}

	private getTimeDataForSending(): object {
		let dataToSend = this._storageUtils.getLocalStoredTime();

		let keysOfYear = Object.keys(dataToSend.time);
		let keysOfMonth = Object.keys(dataToSend.time[keysOfYear[0]]);
		let keysOfDay = Object.keys(dataToSend.time[keysOfYear[0]][keysOfMonth[0]]);

		dataToSend['start'] = new Date(parseInt(keysOfYear[0]), parseInt(keysOfMonth[0]) - 1, parseInt(keysOfDay[0])).valueOf() / 1000;

		let cleanToday = new Date();
		cleanToday.setHours(0, 0, 0, 0);
		dataToSend['end'] = Math.floor(cleanToday.valueOf() / 1000);

		let initialData = {
			type: 'update',
			payload: dataToSend,
		};

		return initialData;
	}
}
