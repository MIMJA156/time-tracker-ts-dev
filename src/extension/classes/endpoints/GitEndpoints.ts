import { git } from "../config.json";
import { Request, Response } from "express";
import { StorageUtils } from "../classes/StorageUtils";
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

                this.storageUtils.local_stored_settings = { gist: { access_token: data["access_token"] } };
                res.send("Success! You can now close this page!");
            });
    }

    public auth(socket: WebSocket, wsServer: Server<WebSocket>) {
        console.log(socket);

        this.state = randomString.generate({
            length: 12
        });

        let gitLinkAccount = `${git.hosts.authorize}?client_id=${git.client_id}&state=${this.state}&scope=gist`;

        socket.send(JSON.stringify({
            gitAuthLink: gitLinkAccount
        }));
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