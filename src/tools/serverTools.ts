// Yes I know its public. LOL
const CLIENT_ID = "995870bf92a88cd7da39";
const CLIENT_SECRET = "c69fdc887f9afc8e3a40aed7219b04460dbf8452";

import { Server } from "http";
import { server as serverConfig } from "./../config.json";
import { getLocalStoredSettings, setLocalStoredSettings } from "./storageTools";
import express from "express";
import fetch from "cross-fetch";
import randomStringGenerator from "randomstring";
import open from "open";
import path from "path";

let randomString = randomStringGenerator.generate({
    length: 8,
    charset: 'alphabetic'
});

const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist&state=${randomString}`;

const app = express();
var server: Server;

app.use("/gui", express.static(path.join(__dirname, './../../public/')));

app.get("/git/callback/", (req, res) => {
    if (req.query.state !== randomString) { res.destroy(); return; }
    let settings = getLocalStoredSettings();
    if (settings.gist.access_token) { res.send("Token Already Saved."); return; }

    fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
        {
            method: 'post',
            headers: { accept: "application/json" }
        }).then(gitRes => {
            if (gitRes.status >= 400) { res.status(400); }
            return gitRes.json();
        }).then(json => {
            settings.gist.access_token = json.access_token;
            setLocalStoredSettings(settings);
            res.sendFile(path.join(__dirname, "./../../public/git.html"));
        });
});

export function startServer() {
    server = app.listen(serverConfig.port);
}

export function stopServer() {
    server.close();
}

export function openInTab() {
    open(url);
}