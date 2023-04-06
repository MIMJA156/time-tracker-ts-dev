import * as vscode from 'vscode';
import { BadgeUtils } from './classes/Utilities/BadgeUtils';
import { StorageUtils } from './classes/Utilities/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { seconds } from './func/timeConverters';
import { APIServiceManager } from './classes/Utilities/APIService';
import config from './config.json';

var timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	const storageUtils = new StorageUtils(context);
	const badgeUtils = new BadgeUtils(context);
	const apiServiceManager = new APIServiceManager(config.server.port);

	timeTracker = new TimeTracker({
		sampleRate: seconds(1),
		badgeUtils,
		storageUtils,
		apiServiceManager,
	});

	timeTracker.start();
}

export function deactivate() {
	timeTracker.stop();
}
