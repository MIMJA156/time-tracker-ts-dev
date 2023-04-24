import * as vscode from 'vscode';
import { BadgeUtils } from './classes/Utilities/BadgeUtils';
import { StorageUtils } from './classes/Utilities/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { seconds } from './func/timeConverters';
import { ServerManager } from './classes/Utilities/ServerUtils';
import config from './config.json';

var timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	const storageUtils = new StorageUtils(context);
	const badgeUtils = new BadgeUtils(context);
	const webServiceManager = new ServerManager(config.server.port);
	// webServiceManager.start();

	timeTracker = new TimeTracker({
		sampleRate: seconds(1),
		badgeUtils,
		storageUtils,
	});

	timeTracker.start();
}

export function deactivate() {
	timeTracker.stop();
}
