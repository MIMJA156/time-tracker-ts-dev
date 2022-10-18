import { github } from "../../config.json";
import { Request, Response } from "express";
import randomString from "randomstring";
import axios from "axios";
import { WebSocket } from "ws";
import { Endpoint } from "./Endpoint";

export class GitEndpoints extends Endpoint {
    private state: string;

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
}