import * as vscode from 'vscode';
import { openInTab, startServer } from './tools/serverTools';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "time-tracker-ts" is now active!');
	startServer();

	setTimeout(() => {
		openInTab();
	}, 5000);
}

export function deactivate() { }
