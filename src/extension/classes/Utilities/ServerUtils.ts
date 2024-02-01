import { RawData, WebSocket, WebSocketServer } from 'ws';
import { StorageUtils } from './StorageUtils';
import { Server, createServer } from 'http';
import express from 'express';
import { Socket } from 'net';
import path from 'path';
import cors from 'cors';
import { SettingsManager } from './SettingsUtils';

export class ServerManager {
    private readonly _port: Number;
    private readonly httpServer: Server;
    private readonly connections: Set<Socket>;
    private readonly messageCallbacks: Map<string, Function>;

    private started: boolean;
    private _storageUtils: StorageUtils;
    private _settingsUtils: SettingsManager;

    private wss: WebSocketServer;

    constructor(port: Number, storageUtils: StorageUtils, settingsUtils: SettingsManager) {
        this._port = port;
        this.connections = new Set();
        this.messageCallbacks = new Map();

        this.httpServer = createServer();
        this.addExpressServerProperties();
        this.addWebSocketProperties();

        this._storageUtils = storageUtils;
        this._settingsUtils = settingsUtils;

        this.httpServer.on('connection', (socket) => {
            this.connections.add(socket);

            socket.once('close', () => {
                this.connections.delete(socket);
            });
        });
    }

    public start(): Promise<string> {
        let promise = new Promise<string>((res, rej) => {
            this.httpServer.listen(this._port, () => {
                this.started = true;
                res('started');
            });
        });
        return promise;
    }

    public stop() {
        this.started = false;
        this.httpServer.close();

        for (const socket of this.connections) {
            socket.destroy();
            this.connections.delete(socket);
        }
    }

    public signal(message: 'UPDATE' | 'SETTINGS') {
        if (!this.started) return;

        let data = {};

        if (message == 'UPDATE') {
            data = this.getTimeDataForSending();
        }

        if (message == 'SETTINGS') {
            data = this.getSettingsDataForSending();
        }

        this.wss.clients.forEach((client) => {
            client.send(JSON.stringify(data));
        });
    }

    public addMessageCallback(message: string, callback: Function) {
        this.messageCallbacks.set(message, callback);
    }

    private addWebSocketProperties() {
        let wss = new WebSocketServer({ server: this.httpServer });

        wss.on('connection', (socket: WebSocket) => {
            socket.send(JSON.stringify(this.getTimeDataForSending()));
            socket.send(JSON.stringify(this.getSettingsDataForSending()));

            socket.on('message', (sentData: RawData) => {
                console.log(`Message ${new Date().toLocaleDateString()} -> ${sentData.toString()}`);

                try {
                    let jsonMessage = JSON.parse(sentData.toString());
                    if (jsonMessage.type) {
                        if (this.messageCallbacks.has(jsonMessage.type)) {
                            let func = this.messageCallbacks.get(jsonMessage.type);
                            func(jsonMessage, this);
                        }
                    }
                } catch (e) {
                    console.warn(e);
                }
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

        expressApplicationInstance.get('/api/get/current-settings-object', (req, res) => {
            res.json(this.getSettingsDataForSending());
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

        return { type: 'update', payload: dataToSend };
    }

    private getSettingsDataForSending(): object {
        let dataToSend = this._settingsUtils.get();
        return { type: 'settings', payload: dataToSend };
    }
}
