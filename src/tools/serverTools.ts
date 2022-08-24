// Yes I know its public. LOL
const CLIENT_ID = "995870bf92a88cd7da39";
const CLIENT_SECRET = "c69fdc887f9afc8e3a40aed7219b04460dbf8452";

import express from "express";
import { Server } from "http";
import fetch from "cross-fetch";
import randomStringGenerator from "randomstring";
import { server as serverConfig } from "./../config.json";
import open from "open";

let randomString = randomStringGenerator.generate({
    length: 8,
    charset: 'alphabetic'
});

const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist&state=${randomString}`;

const app = express();
var server: Server;

app.use(express.static('./../../public'));

app.get("/git/callback/", (req, res) => {
    if (req.query.state !== randomString) { res.destroy(); }

    fetch(`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
        {
            method: 'post',
            headers: { accept: "application/json" }
        }).then(gitRes => {
            if (gitRes.status >= 400) {
                throw new Error("Bad response from server");
            }
            return gitRes.json();
        }).then(json => {
            console.log(json);
            res.send(req.query.code);
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