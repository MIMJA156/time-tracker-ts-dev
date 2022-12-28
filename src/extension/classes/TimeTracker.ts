import * as vscode from 'vscode';
import { seconds } from '../func/timeConverters';
import { Badge, BadgeUtils } from './Utilities//BadgeUtils';
import { StorageUtils } from './Utilities/StorageUtils';

export class TimeTracker {
	private storageUtilities: StorageUtils;
	private sampleRate: number;
	private timeObject: object;
	private sessionStart: number = new Date().getTime();
	private timeAlreadySpent: number;

	private loop: string | number | NodeJS.Timer | undefined;
	private badge: Badge;

	constructor({ sampleRate, storageUtils, badgeUtils }: { sampleRate: number; storageUtils: StorageUtils; badgeUtils: BadgeUtils }) {
		let dateAtCreation = new Date();

		this.storageUtilities = storageUtils;
		this.sampleRate = sampleRate;

		this.timeObject = this.sanitizeTimeObject(this.storageUtilities.getLocalStoredTime());
		this.timeAlreadySpent = this.timeObject['time'][dateAtCreation.getFullYear()][dateAtCreation.getMonth() + 1][dateAtCreation.getDate()].total;

		let newBadge = badgeUtils.createBadge({
			alignment: vscode.StatusBarAlignment.Right,
			priority: Infinity,
			text: '0',
			icon: 'debug-breakpoint-log-unverified',
			tooltip: `Time Spent Coding on ${`${dateAtCreation.getMonth() + 1}/${dateAtCreation.getDate()}/${dateAtCreation.getFullYear()}`}`,
			command: null,
		});

		this.badge = newBadge;
	}

	public start() {
		this.loop = setInterval(() => {
			let currentDate = new Date();
			let timeSpent = this.calculateTimeSpent(this.sessionStart, this.timeAlreadySpent);

			this.timeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total = timeSpent;
			this.badge.text = `${timeSpent}`;
		}, this.sampleRate);
	}

	public stop() {
		clearInterval(this.loop);
	}

	public save() {
		let currentDate = new Date();
		this.timeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()].total = this.calculateTimeSpent(this.sessionStart, this.timeAlreadySpent);
		this.storageUtilities.setLocalStoredTime(this.timeObject);
	}

	private sanitizeTimeObject(givenTimeObject: object) {
		let currentDate = new Date();

		if (!givenTimeObject['time']) {
			givenTimeObject['time'] = {};
		}

		if (!givenTimeObject['time'][currentDate.getFullYear()]) {
			givenTimeObject['time'][currentDate.getFullYear()] = {};
		}

		if (!givenTimeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1]) {
			givenTimeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1] = {};
		}

		if (!givenTimeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()]) {
			givenTimeObject['time'][currentDate.getFullYear()][currentDate.getMonth() + 1][currentDate.getDate()] = {
				total: 0,
			};
		}

		return givenTimeObject;
	}

	private calculateTimeSpent(sessionStart: number, timeAlreadySpent: number) {
		let current = new Date();
		let result = current.getTime() - sessionStart + timeAlreadySpent;
		return result;
	}
}
