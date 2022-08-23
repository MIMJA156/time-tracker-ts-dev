import * as vscode from 'vscode';
import { startServer } from './tools/serverTools';
import env from 'dotenv';
env.config();

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "time-tracker-ts" is now active!');

	startServer();
}

export function deactivate() { }
