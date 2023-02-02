import * as vscode from 'vscode';
import { BadgeUtils } from './Utilities/BadgeUtils';
import { StorageUtils } from './Utilities/StorageUtils';
import { MillisecondsToSeconds, SecondsToHoursMinutesSeconds } from './../func/timeConverters';

export class TimeTracker {
	timeInterval: NodeJS.Timer;

	totalTime: number;
	preExistingTimeData: object;
	sampleRate: number;
	displayBadge: import('./Utilities/BadgeUtils').Badge;

	storageUtils: StorageUtils;

	constructor({ sampleRate, storageUtils, badgeUtils }: { sampleRate: number; storageUtils: StorageUtils; badgeUtils: BadgeUtils }) {
		let savedInformation = this.sanitize(storageUtils.getLocalStoredTime());

		let currentDate = new Date();
		this.totalTime = savedInformation['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1][currentDate.getUTCDate()].total;

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

		this.storageUtils = storageUtils;
	}

	public start() {
		let today = new Date();
		let todayDay = today.getUTCDay();

		this.timeInterval = setInterval(() => {
			let maybeTodayDay = new Date().getUTCDay();

			if (maybeTodayDay !== todayDay) {
				console.log('New Day!');

				this.preExistingTimeData['time'][today.getUTCFullYear()][today.getUTCMonth() + 1][today.getUTCDate()].total = this.totalTime;
				this.preExistingTimeData = this.sanitize(this.preExistingTimeData);

				this.totalTime = 0;
			}

			this.totalTime += MillisecondsToSeconds(this.sampleRate);

			let humanReadableTimes = SecondsToHoursMinutesSeconds(this.totalTime);
			this.displayBadge.text = `${humanReadableTimes.hours} hr : ${humanReadableTimes.minutes} min : ${humanReadableTimes.seconds} sec`;
		}, this.sampleRate);
	}

	public stop() {
		clearInterval(this.timeInterval);

		let currentDate = new Date();
		this.preExistingTimeData['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1][currentDate.getUTCDate()].total = this.totalTime;

		this.storageUtils.setLocalStoredTime(this.preExistingTimeData);
	}

	private sanitize(timeValues: object) {
		let currentDate = new Date();

		if (!timeValues['time']) {
			timeValues['time'] = {};
		}

		if (!timeValues['time'][currentDate.getUTCFullYear()]) {
			timeValues['time'][currentDate.getUTCFullYear()] = {};
		}

		if (!timeValues['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1]) {
			timeValues['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1] = {};
		}

		if (!timeValues['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1][currentDate.getUTCDate()]) {
			timeValues['time'][currentDate.getUTCFullYear()][currentDate.getUTCMonth() + 1][currentDate.getUTCDate()] = {
				total: 0,
			};
		}

		return timeValues;
	}
}
