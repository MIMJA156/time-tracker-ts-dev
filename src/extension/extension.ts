import * as vscode from "vscode";
import { ExpressServer } from "./classes/ExpressServer";
import { server as serverVars } from "./config.json";
import { StorageUtils } from "./classes/StorageUtils";

export function activate(context: vscode.ExtensionContext) {
    let storageUtils = new StorageUtils(context);

    let server = new ExpressServer(serverVars.port, storageUtils);
    server.start();

    console.log('Hello World from Time Tracker!');
}

export function deactivate() { }