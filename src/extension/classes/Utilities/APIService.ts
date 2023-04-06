import express from 'express';
import path from 'path';
import cors from 'cors';
import { Server } from 'http';
import { Socket } from 'net';

export class APIServiceManager {
	_port: number;
	_application: express.Application;
	_webServer: Server;
	_connections: Socket[];

	constructor(port: number) {
		this._port = port;
		this._application = express();
		this._application.use(cors());

		this.defineEndpoints();
	}

	defineEndpoints() {
		this._application.use('/', express.static(path.join(__dirname, '/web/')));
	}

	start() {
		this._webServer = this._application.listen(this._port);

		this._webServer.on('connection', (connection) => {
			this._connections.push(connection);
			connection.on('close', () => (this._connections = this._connections.filter((curr) => curr !== connection)));
		});
	}

	stop() {
		this._webServer.close(() => {
			console.log('Closed out remaining connections');
		});

		this._connections.forEach((curr) => curr.end());
		setTimeout(() => this._connections.forEach((curr) => curr.destroy()), 5000);
	}

	openInBrowser() {}
}
