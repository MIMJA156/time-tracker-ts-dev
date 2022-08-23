import express from 'express';
import { Server } from 'http';
import { server as serverConfig } from "./../config.json";
import passport from 'passport';
import GitHubStrategy from 'passport-github';
import { Express } from 'express-serve-static-core';
import { getLocalStoredSettings, setLocalStoredSettings } from './storageTools';

passport.use(new GitHubStrategy({
    clientID: "4458bb8ab1fe56513ac5",
    clientSecret: "d2136654dabcf7f521abd9538b4ec4877be95adc",
    callbackURL: `http://127.0.0.1:3803/git/cb`
},
    function (accessToken, refreshToken, profile, cb) {
        let settings = getLocalStoredSettings();
        settings.accessToken = accessToken;
        setLocalStoredSettings(settings);

        cb(null, { accessToken, refreshToken, profile });
    }
));

var app: Express;
var server: Server;
var booted: Boolean = false;

export function startServer() {
    if (booted) { return; }

    booted = true;

    app = express();
    app.use(express.json());
    app.use(passport.initialize());

    app.get("/hub", (req, res) => {
        res.send(":3");
    });

    app.get("/git", passport.authenticate('github', { session: false }),);

    app.get("/git/cb",
        passport.authenticate('github', { session: false }),
        function (req, res) {
            res.send("Hello");
        });

    server = app.listen(serverConfig.port);
}

export function stopServer() {
    if (!booted) { return; }
    server.close();
    server.removeAllListeners();
    booted = false;
}