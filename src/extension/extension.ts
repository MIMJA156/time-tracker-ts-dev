import * as vscode from 'vscode';
import { StorageUtils } from './classes/StorageUtils';
import { TimeTracker } from './classes/TimeTracker';
import { seconds } from './func/timeConverters';

var timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hello World from Time Tracker!');

	const storageUtils = new StorageUtils(context);

	timeTracker = new TimeTracker({
		sampleRate: seconds(5),
		storageUtils,
	});
}

export function deactivate() {
	timeTracker.save();
	timeTracker.stop();
}
