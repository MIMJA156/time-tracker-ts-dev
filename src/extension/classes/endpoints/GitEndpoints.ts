import { github } from "../../config.json";
import { Request, Response } from "express";
import { StorageUtils } from "../StorageUtils";
import randomString from "randomstring";
import axios from "axios";
import { Server, WebSocket } from "ws";

export class GitEndpoints {
    private storageUtils: StorageUtils;

    private state: string;
    private wsServer: Server<WebSocket>;

    constructor(storageUtils: StorageUtils, wsServer: Server<WebSocket>) {
        this.storageUtils = storageUtils;
        this.wsServer = wsServer;
    }

    public callback(req: Request, res: Response) {
        if (req.query.state !== this.state) {
            this.state = randomString.generate({ length: 12 });
            res.destroy();
            return;
        }

        axios.post(`${github.hosts.access_token}?client_id=${github.client_id}&client_secret=${github.client_secret}&code=${req.query.code}`)
            .then(response => {
                let data = this.getValuesFromData(response.data);

                if (data["error"]) {
                    res.send(data["error"]);
                    return;
                }

                let settings = this.storageUtils.getLocalStoredSettings();
                settings.gist.access_token = data["access_token"];
                this.storageUtils.setLocalStoredSettings(settings);

                this.sendToEveryone({
                    to: "client",
                    action: "github.callback",
                    status: 1
                });

                res.send(`<script type="text/javascript">window.close();</script>`);
            });
    }

    public auth(socket: WebSocket) {
        if (this.storageUtils.getLocalStoredSettings().gist.access_token) {
            socket.send(JSON.stringify({
                to: "client",
                action: "github.auth",
                status: -1
            }));
            return;
        }

        this.state = randomString.generate({
            length: 12
        });

        let gitLinkAccount = `${github.hosts.authorize}?client_id=${github.client_id}&state=${this.state}&scope=gist`;

        socket.send(JSON.stringify({
            to: "client",
            action: "github.auth",
            status: 1,
            gitAuthLink: gitLinkAccount
        }));
    }

    public remove(socket: WebSocket) {
        if (this.storageUtils.getLocalStoredSettings().gist.access_token) {
            let settings = this.storageUtils.getLocalStoredSettings();
            settings.gist.access_token = "";
            this.storageUtils.setLocalStoredSettings(settings);

            this.sendToEveryone({
                to: "client",
                action: "github.remove",
                status: 1
            })
        } else {
            socket.send(JSON.stringify({
                to: "client",
                action: "github.remove",
                status: -1
            }));
        }
    }

    private getValuesFromData(data: string): Object {
        let final = {};
        let splitData = data.split("&");

        for (data of splitData) {
            let newSplitData = data.split("=");
            final[newSplitData[0]] = newSplitData[1];
        }

        return final;
    }

    private sendToEveryone(data: object) {
        this.wsServer.clients.forEach((client) => {
            client.send(JSON.stringify(data));
        });
    }
}