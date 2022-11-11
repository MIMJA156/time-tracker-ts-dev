import * as vscode from 'vscode';
import { ExpressServer } from './classes/ExpressServer';
import { server as serverVars } from './config.json';
import { StorageUtils } from './classes/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { minutes, seconds } from './classes/TimeTypes';

export function activate(context: vscode.ExtensionContext) {
	let storageUtils = new StorageUtils(context);
	// let server = new ExpressServer(serverVars.port, storageUtils);
	// server.start();

	let tracker = new TimeTracker({
		idleTimeout: minutes(5),
		saveInterval: seconds(1),
		storageUtils,
	});

	tracker.start();

	console.log('Hello World from Time Tracker!');
}

export function deactivate() {}
