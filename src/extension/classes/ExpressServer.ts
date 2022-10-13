import express from 'express';
import { IncomingMessage, Server as httpServer, ServerResponse } from 'http';
import path from "path";
import { Server, WebSocket, WebSocketServer } from "ws";
import { GitEndpoints } from '../tools/endpoints';
import { StorageUtils } from './StorageUtils';

export class ExpressServer {
    private _port: number;

    private app: express.Application;
    private wsServer: Server<WebSocket>;
    private server: httpServer<typeof IncomingMessage, typeof ServerResponse>;

    private storageUtils: StorageUtils;

    private gitEndpoints: GitEndpoints;

    constructor(port: number, providedStorageUtils: StorageUtils) {
        this.storageUtils = providedStorageUtils;

        this._port = port;
        this.app = this.initApp(express());
        this.wsServer = this.initWsServer(new WebSocketServer({ noServer: true }));

        this.gitEndpoints = new GitEndpoints(this.storageUtils);
    }

    public get port(): number {
        return this._port;
    }

    private initApp(app: express.Application) {
        app.use(express.json());
        app.use("/gui", express.static(path.resolve(__dirname, "web")));

        app.get("/git/callback", (req, res) => this.gitEndpoints.callBack(req, res));

        return app;
    }

    private initWsServer(wsServer: Server<WebSocket>) {
        wsServer.on('connection', socket => {
            console.log("Gained a client.");

            socket.on('message', message => {
                let object = JSON.parse(message.toString());
                if (object.type === "git") {
                    if (object.invoke === "auth") {
                        this.gitEndpoints.auth(socket, wsServer);
                    }
                }
            });

            socket.on("close", () => {
                console.log("Lost a client.");
            });
        });
        return wsServer;
    }

    public start() {
        let server = this.app.listen(this._port, () => {
            console.log("Server Started.");
        });

        server.on('upgrade', (request: any, socket: any, head: any) => {
            this.wsServer.handleUpgrade(request, socket, head, (socket: any) => {
                this.wsServer.emit('connection', socket, request);
            });
        });

        this.server = server;
    }

    public stop() {
        this.wsServer.clients.forEach(client => {
            client.close();
        });

        this.server.close(() => {
            console.log("Server Closed.");
        });
    }
}