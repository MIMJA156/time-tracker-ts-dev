import * as vscode from "vscode";
import { getTimeGist } from "./tools/gistTools";
import { openInTab, startServer } from "./tools/serverTools";
import { setStoragePaths } from "./tools/storageTools";

export function activate(context: vscode.ExtensionContext) {
	setStoragePaths(context);
	startServer();
	openInTab();
	console.log('Congratulations, your extension "time-tracker-ts" is now active!');
}

export function deactivate() { }
