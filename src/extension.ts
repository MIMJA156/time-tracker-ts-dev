import * as vscode from "vscode";
import { openInTab, startServer } from "./tools/serverTools";
import { runModelMatching, setStoragePaths } from "./tools/storageTools";

export function activate(context: vscode.ExtensionContext) {
	setStoragePaths(context);

	runModelMatching();

	console.log('Congratulations, your extension "time-tracker-ts" is now active!');
}

export function deactivate() { }
