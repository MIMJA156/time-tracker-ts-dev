import express from 'express';
import { IncomingMessage, Server as httpServer, ServerResponse } from 'http';
import path from "path";
import { Server, WebSocket, WebSocketServer } from "ws";
import { GitEndpoints } from './endpoints/GitEndpoints';
import { StorageUtils } from './StorageUtils';

export class ExpressServer {
    private readonly _port: number;

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

        this.gitEndpoints = new GitEndpoints(this.storageUtils, this.wsServer);

        this.server = new httpServer<typeof IncomingMessage, typeof ServerResponse>();
    }

    public get port(): number {
        return this._port;
    }

    private initApp(app: express.Application) {
        app.use(express.json());
        app.use("/", express.static(path.resolve(__dirname, "web")));

        app.get("/github/callback", (req, res) => this.gitEndpoints.callback(req, res));

        return app;
    }

    private initWsServer(wsServer: Server<WebSocket>) {
        wsServer.on('connection', socket => {
            console.log("Gained a client.");

            socket.send(JSON.stringify({
                to: "client",
                action: "system.init",
                package: {
                    githubAccountAdded: this.storageUtils.getLocalStoredSettings().gist.access_token ? true : false
                }
            }));

            socket.on('message', message => {
                let json = JSON.parse(message.toString());
                let actionArray = json.action.split(".");

                if (json.to === "server") {
                    if (actionArray[0] === "github") {
                        this.gitEndpoints[actionArray[1]](socket);
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