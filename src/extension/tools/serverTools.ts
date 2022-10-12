import express from "express";
import { Server } from "http";
import { server, git } from "./../config.json";
import { getLocalStoredSettings } from "./storageTools";
import axios from "axios";
import { loginUser } from "./gistTools";

let currentLocalSettings = getLocalStoredSettings();

const expressApp = express();
let runningServer: Server;

expressApp.use(express.json());

export function bootServer() {
    let promise = new Promise((resolve, reject) => {
        runningServer = expressApp.listen(server.port, () => {
            console.log(`Server Opened! Port:${server.port}`);
            resolve(true);
        });
    });

    return promise;
}

export function killServer() {
    let promise = new Promise((resolve, reject) => {
        runningServer.close(() => {
            console.log("Server Closed!");
            resolve(true);
        });
    });

    return promise;
}

expressApp.get("/git/callback", (req, res) => {
    if (currentLocalSettings.git.access_token !== "") {
        return res.send("!");
    }

    axios.post(`https://github.com/login/oauth/access_token?client_id=${git.CLIENT_ID}&client_secret=${git.CLIENT_SECRET}&code=${req.query.code}`, null).then(re => {
        let parsedUrl = parseUrl(re.data);
        console.log(parsedUrl);
        loginUser(parsedUrl["access_token"], parsedUrl["username"]);
        res.send("You can close this page now!");
    });
});

function parseUrl(url: string) {
    let object = {};
    let urlParams = url.split("&");

    urlParams.forEach(item => {
        let splitItem = item.split("=");

        object[splitItem[0]] = splitItem[1];
    });

    return object;
}