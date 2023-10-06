import * as vscode from 'vscode';
import config from './config.json';
import { TimeTracker } from './classes/TimeTracker';
import { BadgeUtils } from './classes/Utilities/BadgeUtils';
import { StorageUtils } from './classes/Utilities/StorageUtils';
import { SecondsToMilliseconds } from './func/timeConverters';
import { ServerManager } from './classes/Utilities/ServerUtils';
import { SettingsManager } from './classes/Utilities/SettingsUtils';

let timeTracker: TimeTracker;

export function activate(context: vscode.ExtensionContext) {
    console.log('Hello World from Time Tracker!');
    // console.log('ps: Maple says hi');

    const storageUtils = new StorageUtils(context);
    const settingsManager = new SettingsManager(storageUtils);
    const badgeUtils = new BadgeUtils(context);
    const serverManager = new ServerManager(config.server.port, storageUtils);

    serverManager.addMessageCallback('settings', (data: any, parent: ServerManager) => settingsManager.handler(data, parent));

    timeTracker = new TimeTracker({
        sampleRate: SecondsToMilliseconds(1),
        badgeUtils,
        storageUtils,
        serverManager,
    });

    timeTracker.start();
}

export function deactivate() {
    timeTracker.stop();
}
