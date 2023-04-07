import * as vscode from 'vscode';
import { BadgeUtils } from './Utilities/BadgeUtils';
import { StorageUtils } from './Utilities/StorageUtils';
import { APIServiceManager } from './Utilities/APIService';
import { MillisecondsToSeconds, SecondsToHoursMinutesSeconds, minutes } from './../func/timeConverters';

export class TimeTracker {
	timeInterval: NodeJS.Timer;

	totalTime: number;
	preExistingTimeData: object;
	sampleRate: number;
	displayBadge: import('./Utilities/BadgeUtils').Badge;

	storageUtils: StorageUtils;

	constructor({ sampleRate, storageUtils, badgeUtils, apiServiceManager }: { sampleRate: number; storageUtils: StorageUtils; badgeUtils: BadgeUtils; apiServiceManager: APIServiceManager }) {
		let savedInformation = this.sanitize(storageUtils.getLocalStoredTime());

		let currentDate = new Date();
		this.totalTime = savedInformation['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total;

		this.preExistingTimeData = savedInformation;
		this.sampleRate = sampleRate;
		this.displayBadge = badgeUtils.createBadge(
			{
				icon: 'timeline-view-icon',
				text: 'Starting Time Loop...',
				tooltip: `Time Spent Coding Today!`,
				alignment: vscode.StatusBarAlignment.Right,
				priority: 10,
				command: null,
			},
			true,
		);

		// >>> -- NOT PERMANENT CODE
		let stopServer = badgeUtils.createBadge(
			{
				icon: 'none',
				text: 'Stop Web Server',
				tooltip: 'Stops the current web server',
				alignment: vscode.StatusBarAlignment.Right,
				priority: 10,
				command: null,
			},
			false,
		);

		badgeUtils.linkCommandToBadge(stopServer, 'time-tracker-stop-server', () => {
			stopServer.show(false);
			apiServiceManager.stop();
		});
		// <<< -- NOT PERMANENT CODE

		badgeUtils.linkCommandToBadge(this.displayBadge, 'time-tracker-start-server', () => {
			stopServer.show(true);
			apiServiceManager.start();
			apiServiceManager.openInBrowser();
		});

		this.storageUtils = storageUtils;
	}

	public start() {
		let today = new Date();
		let todayDay = today.getDay();

		this.timeInterval = setInterval(() => {
			let maybeTodayDay = new Date().getDay();

			if (maybeTodayDay !== todayDay) {
				this.preExistingTimeData['time'][today.getFullYear()][today.getMonth() + 1][today.getDate()].total = this.totalTime;
				this.save();

				this.totalTime = 0;
				today = new Date();
				todayDay = today.getDay();
			}

			this.totalTime += MillisecondsToSeconds(this.sampleRate);

			if (this.totalTime % MillisecondsToSeconds(minutes(1)) === 0) {
				this.preExistingTimeData['time'][today.getFullYear()][today.getMonth() + 1][today.getDate()].total = this.totalTime;
				this.save();
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
		this.storageUtils.setLocalStoredTime(this.preExistingTimeData);
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
				timeZone: [currentDate.getTimezoneOffset()],
			};
		}

		return timeValues;
	}
}
