import { git } from "../../config.json";
import { Request, Response } from "express";
import { StorageUtils } from "../../classes/StorageUtils";
import randomString from "randomstring";
import axios from "axios";
import { Server, WebSocket } from "ws";

export class GitEndpoints {
    private storageUtils: StorageUtils;

    private state: string;

    constructor(storageUtils: StorageUtils) {
        this.storageUtils = storageUtils;
    }

    public callBack(req: Request, res: Response) {
        if (req.query.state !== this.state) {
            this.state = randomString.generate({
                length: 12
            });
            res.send("Invalid Request");
            return;
        }

        axios.post(`${git.hosts.access_token}?client_id=${git.client_id}&client_secret=${git.client_secret}&code=${req.query.code}`)
            .then(response => {
                let data = this.getValuesFromData(response.data);

                if (data["error"]) {
                    res.send(data["error"]);
                    return;
                }

                let settings = this.storageUtils.getLocalStoredSettings();
                settings.gist.access_token = data["access_token"];
                this.storageUtils.setLocalStoredSettings(settings);

                res.send("Success! You can now close this page!");
            });
    }

    public auth(socket: WebSocket) {
        if (this.storageUtils.getLocalStoredSettings().gist.access_token) {
            return;
        }

        this.state = randomString.generate({
            length: 12
        });

        let gitLinkAccount = `${git.hosts.authorize}?client_id=${git.client_id}&state=${this.state}&scope=gist`;

        socket.send(JSON.stringify({
            gitAuthLink: gitLinkAccount
        }));
    }

    public remove(socket: WebSocket) {
        console.log("removing");

        if (this.storageUtils.getLocalStoredSettings().gist.access_token) {
            let settings = this.storageUtils.getLocalStoredSettings();
            settings.gist.access_token = "";
            this.storageUtils.setLocalStoredSettings(settings);

            socket.send(JSON.stringify({
                action: "git.remove"
            }));
        } else {
            return;
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
}