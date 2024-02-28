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

    const badgeUtils = new BadgeUtils(context);
    const storageUtils = new StorageUtils(context);
    const settingsManager = new SettingsManager(storageUtils);
    const serverManager = new ServerManager(config.server.port, storageUtils, settingsManager);

    serverManager.addMessageCallback('settings', (data: any, parent: ServerManager) => settingsManager.settingChangedHandler(data, parent));
    serverManager.addMessageCallback('settings:reset', (data: any, parent: ServerManager) => settingsManager.settingResetHandler(data, parent));

    timeTracker = new TimeTracker({
        sampleRate: SecondsToMilliseconds(1),
        context,
        badgeUtils,
        storageUtils,
        serverManager,
        settingsManager,
    });

    timeTracker.start();
}

export function deactivate() {
    timeTracker.stop();
}
