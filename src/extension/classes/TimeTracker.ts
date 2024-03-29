import open from 'open';
import config from './../config.json';
import * as vscode from 'vscode';
import { BadgeUtils } from './Utilities/BadgeUtils';
import { StorageUtils } from './Utilities/StorageUtils';
import { ServerManager } from './Utilities/ServerUtils';
import { MillisecondsToSeconds, SecondsToHoursMinutesSeconds } from '../func/timeConverters';
import mergeInOldTimeObject from '../func/mergeInOldTimeObject';
import { SettingsManager } from './Utilities/SettingsUtils';

export class TimeTracker {
    timeInterval: NodeJS.Timeout;

    totalTime: number;
    sampleRate: number;
    preExistingTimeData: object;
    displayBadge: import('./Utilities/BadgeUtils').Badge;

    badgeIcon: string;
    badgePriority: number;
    badgeAlignment: vscode.StatusBarAlignment;

    storageUtils: StorageUtils;
    serverManager: ServerManager;

    constructor({ sampleRate, context, storageUtils, badgeUtils, serverManager, settingsManager }: { sampleRate: number; context: vscode.ExtensionContext; storageUtils: StorageUtils; badgeUtils: BadgeUtils; serverManager: ServerManager; settingsManager: SettingsManager }) {
        let savedInformation = this.sanitize(storageUtils.getLocalStoredTime());

        let currentDate = new Date();
        this.totalTime = savedInformation['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total;

        let humanReadableTimes = SecondsToHoursMinutesSeconds(this.totalTime);

        this.setInternalsBasedOnSettings();

        this.preExistingTimeData = savedInformation;
        this.sampleRate = sampleRate;
        this.displayBadge = badgeUtils.createBadge(
            {
                icon: this.badgeIcon == null || this.badgeIcon == '' ? 'timeline-view-icon' : this.badgeIcon,
                text: `${humanReadableTimes.hours} hr : ${humanReadableTimes.minutes} min : ${humanReadableTimes.seconds} sec`,
                tooltip: `Time Spent Coding Today!`,
                alignment: this.badgeAlignment == null ? vscode.StatusBarAlignment.Right : this.badgeAlignment,
                priority: this.badgePriority == null ? 10 : this.badgePriority,
                command: null,
            },
            true,
        );

        // <=//// unused as of now in production, mostly for easy testing
        let stopServer = badgeUtils.createBadge({
            icon: 'none',
            text: 'Stop Time Tracker Web Server',
            tooltip: 'Stops the current time tracker gui web server',
            alignment: this.badgeAlignment == null ? vscode.StatusBarAlignment.Right : this.badgeAlignment,
            priority: this.badgePriority == null ? 10 : this.badgePriority,
            command: null,
        });

        badgeUtils.linkCommandToBadge(stopServer, `${config['extension-id']}.time-tracker-stop-server`, () => {
            if (!this.serverManager.isStarted()) return;

            stopServer.show(false);
            serverManager.stop();
        });
        // <=////

        badgeUtils.linkCommandToBadge(this.displayBadge, `${config['extension-id']}.time-tracker-start-server`, () => {
            if (this.serverManager.isStarted()) return open(`http://localhost:${config.server.port}/dashboard`).then((r) => console.log(r));

            // stopServer.show(true);
            serverManager.start().then((_) => {
                open(`http://localhost:${config.server.port}/dashboard`).then((r) => console.log(r));
            });
        });

        context.subscriptions.push(
            vscode.commands.registerCommand(`${config['extension-id']}.importOldTimeData`, () => {
                let settings = settingsManager.get();
                let hasImported = settings['flags']['hasImported'];

                if (hasImported) {
                    vscode.window.showWarningMessage('you have already imported your time data, it is not recommend to import time data more than once.', 'import anyways').then((response) => {
                        if (response === 'import anyways') {
                            let _settings = settingsManager.get();
                            _settings['flags']['hasImported'] = false;
                            settingsManager.set(_settings);

                            vscode.commands.executeCommand(`${config['extension-id']}.importOldTimeData`);
                        }
                    });
                    return;
                }

                let oldTime = storageUtils.getOldLocalStoredTime();

                if (oldTime == null) {
                    vscode.window.showErrorMessage("old time json file does not exist, can't continue import.");
                    return;
                }

                let mergedObject = mergeInOldTimeObject(this.preExistingTimeData, oldTime);

                this.stop();
                let cleanMergedObject = this.sanitize({ time: mergedObject });
                storageUtils.setLocalStoredTime(cleanMergedObject);

                let currentDate = new Date();
                this.totalTime = cleanMergedObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total;

                this.preExistingTimeData = cleanMergedObject;
                this.start();

                settings['flags']['hasImported'] = true;
                settingsManager.set(settings);

                vscode.window.showInformationMessage('successfully imported time data.');
            }),
        );

        this.storageUtils = storageUtils;
        this.serverManager = serverManager;

        vscode.workspace.onDidChangeConfiguration(() => {
            this.setInternalsBasedOnSettings();

            this.displayBadge.alignment = this.badgeAlignment == null ? vscode.StatusBarAlignment.Right : this.badgeAlignment;
            this.displayBadge.icon = this.badgeIcon == null || this.badgeIcon == '' ? 'timeline-view-icon' : this.badgeIcon;
            this.displayBadge.priority = this.badgePriority == null ? 10 : this.badgePriority;
        });
    }

    public start() {
        let today = new Date();
        let todayDay = today.getDay();

        this.serverManager.signal('UPDATE');

        this.timeInterval = setInterval(() => {
            let maybeToday = new Date();
            let maybeTodayDay = maybeToday.getDay();
            let dayData = this.preExistingTimeData['time'][today.getFullYear()][today.getMonth() + 1][today.getDate()];

            this.totalTime += MillisecondsToSeconds(this.sampleRate);

            if (this.totalTime % 60 === 0) {
                dayData.total = this.totalTime;
                this.save();

                this.serverManager.signal('UPDATE');
            }

            if (maybeTodayDay !== todayDay) {
                dayData.total = this.totalTime;
                this.save();

                this.totalTime = 0;
                today = new Date();
                todayDay = today.getDay();
            }

            let humanReadableTimes = SecondsToHoursMinutesSeconds(this.totalTime);
            this.displayBadge.text = `${humanReadableTimes.hours} hr : ${humanReadableTimes.minutes} min : ${humanReadableTimes.seconds} sec`;
        }, this.sampleRate);
    }

    public stop() {
        clearInterval(this.timeInterval);
        let currentDate = new Date();
        this.preExistingTimeData['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total = this.totalTime;

        this.save();
    }

    private save() {
        this.preExistingTimeData = this.sanitize(this.preExistingTimeData);
        this.storageUtils.setLocalStoredTime(this.preExistingTimeData, true);
    }

    private sanitize(timeValues: object) {
        let currentDate = new Date();

        if (!timeValues['time']) {
            timeValues['time'] = {};
        }

        if (!timeValues['time'][currentDate.getFullYear()]) {
            timeValues['time'][currentDate.getFullYear()] = {};
        }

        if (!timeValues['time'][currentDate.getFullYear()][currentDate.getMonth() + 1]) {
            timeValues['time'][currentDate.getFullYear()][currentDate.getMonth() + 1] = {};
        }

        if (!timeValues['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()]) {
            timeValues['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()] = {
                total: 0,
            };
        }

        return timeValues;
    }

    private setInternalsBasedOnSettings() {
        let configuration = vscode.workspace.getConfiguration();

        let icon = configuration.get(`${config['extension-id']}.iconStyle`);
        let alignment = configuration.get(`${config['extension-id']}.labelPosition`);
        let priority = configuration.get(`${config['extension-id']}.labelPriority`);

        this.badgeIcon = icon as string;

        if (alignment == 'Left') this.badgeAlignment = vscode.StatusBarAlignment.Left;
        else this.badgeAlignment = vscode.StatusBarAlignment.Right;

        if (priority) this.badgePriority = priority === vscode.StatusBarAlignment.Right ? Infinity : -Infinity;
        else this.badgePriority = priority === vscode.StatusBarAlignment.Right ? -Infinity : Infinity;
    }
}
