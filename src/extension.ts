import * as vscode from "vscode";
import { getGist } from "./tools/gistTools";
import { getLocalStoredSettings, runModelMatching, setStoragePaths } from "./tools/storageTools";

export function activate(context: vscode.ExtensionContext) {
	setStoragePaths(context);
	runModelMatching();

	let currentLocalSettings = getLocalStoredSettings();
	getGist(currentLocalSettings.git.access_token, currentLocalSettings.git.gist_id);

	console.log('Congratulations, your extension "time-tracker-ts" is now active!');
}

export function deactivate() { }
