import * as vscode from 'vscode';
import { ExpressServer } from './classes/ExpressServer';
import { server as serverVars } from './config.json';
import { StorageUtils } from './classes/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { minutes, seconds } from './func/timeConverters';
import { BadgeUtils } from './classes/BadgeUtils';

let tracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	let storageUtils = new StorageUtils(context);
	let badgeUtils = new BadgeUtils(context);

	// let server = new ExpressServer(serverVars.port, storageUtils);
	// server.start();

	tracker = new TimeTracker({
		sampleRate: seconds(5),
		storageUtils,
		badgeUtils,
	});

	tracker.start();
}

export function deactivate() {
	tracker.saveTime();
	tracker.stop();
}
