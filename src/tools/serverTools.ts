import express, { Request, Response } from 'express';
import { Server } from 'http';
import { server as serverConfig } from "./../config.json";

var app = null;
var server: Server;

export function startServer() {
    app = express();
    app.use(express.json());

    app.get("/auth/git/cb", (req, res) => {
        res.send("Git Hub!");
    });

    app.get("/hub", (req, res) => {
        res.send(":3");
    });

    server = app.listen(serverConfig.port);
}

export function stopServer() {
    server.close();
    server.removeAllListeners();
    app = null;
}