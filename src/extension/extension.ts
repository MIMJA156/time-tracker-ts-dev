
import * as vscode from "vscode";
import { getGist } from "./tools/gistTools";
import { bootServer, killServer } from "./tools/serverTools";
import { getLocalStoredSettings, runModelMatching, setStoragePaths } from "./tools/storageTools";

export function activate(context: vscode.ExtensionContext) {
    setStoragePaths(context);
    runModelMatching();

    let currentLocalSettings = getLocalStoredSettings();
    getGist(currentLocalSettings.git.access_token, currentLocalSettings.git.gist_id);

    console.log('Hello World from Time Tracker!');
}

export function deactivate() { }