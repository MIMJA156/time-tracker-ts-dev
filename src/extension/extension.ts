import * as vscode from 'vscode';
import { BadgeUtils } from './classes/Utilities/BadgeUtils';
import { StorageUtils } from './classes/Utilities/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { seconds } from './func/timeConverters';

var timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	const storageUtils = new StorageUtils(context);
	const badgeUtils = new BadgeUtils(context);

	timeTracker = new TimeTracker({
		sampleRate: seconds(5),
		storageUtils,
		badgeUtils,
	});

	timeTracker.start();
}

export function deactivate() {
	timeTracker.save();
	timeTracker.stop();
}
