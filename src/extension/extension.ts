import * as vscode from 'vscode';
import { ExpressServer } from './classes/ExpressServer';
import { server as serverVars } from './config.json';
import { StorageUtils } from './classes/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { minutes, seconds } from './func/timeConverters';

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	let storageUtils = new StorageUtils(context);
	// let server = new ExpressServer(serverVars.port, storageUtils);
	// server.start();

	let tracker = new TimeTracker({
		badgeUpdateRate: seconds(1),
		storageUtils,
	});

	tracker.start();
}

export function deactivate() {}
