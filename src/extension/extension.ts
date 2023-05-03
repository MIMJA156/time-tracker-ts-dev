import * as vscode from 'vscode';
import config from './config.json';
import { TimeTracker } from './classes/TimeTracker';
import { BadgeUtils } from './classes/Utilities/BadgeUtils';
import { StorageUtils } from './classes/Utilities/StorageUtils';
import { SecondsToMilliseconds } from './func/timeConverters';
import { ServerManager } from './classes/Utilities/ServerUtils';

var timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	const storageUtils = new StorageUtils(context);
	const badgeUtils = new BadgeUtils(context);
	const serverManager = new ServerManager(config.server.port);

	timeTracker = new TimeTracker({
		sampleRate: SecondsToMilliseconds(5),
		badgeUtils,
		storageUtils,
		serverManager,
	});

	timeTracker.start();
}

export function deactivate() {
	timeTracker.stop();
}
