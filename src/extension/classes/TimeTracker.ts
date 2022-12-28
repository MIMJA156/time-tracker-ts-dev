import { translateMilliseconds } from '../func/timeConverters';
import { BadgeUtils } from './BadgeUtils';
import { StorageUtils } from './StorageUtils';

export class TimeTracker {
	public time: number = 0;
	private counter: NodeJS.Timer;
	private sinceStart: Date = new Date();
	private sampleRate: number;
	private savedValues: Object;
	private storageUtils: StorageUtils;
	private badgeUtils: BadgeUtils;

	constructor({ sampleRate, storageUtils, badgeUtils }) {
		this.sampleRate = sampleRate;
		this.storageUtils = storageUtils;
		this.badgeUtils = badgeUtils;

		this.savedValues = this.verifyTime(this.loadTime());
	}

	saveTime() {
		let rightNow = new Date();
		this.savedValues['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]['total'] = this.calculateTime();
		this.storageUtils.setLocalStoredTime(this.savedValues);
	}

	start() {
		this.counter = setInterval(() => {
			this.time = this.calculateTime();
			this.badgeUtils.text(translateMilliseconds(this.time).seconds);
		}, this.sampleRate);
	}

	stop() {
		clearInterval(this.counter);
	}

	private calculateTime() {
		let rightNow = new Date();
		if (rightNow.getDate() !== this.sinceStart.getDate() || rightNow.getMonth() !== this.sinceStart.getMonth()) {
			this.sinceStart = rightNow;
		}
		let oldTime = this.savedValues['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]['total'] !== undefined ? this.savedValues['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]['total'] : 0;
		return rightNow.getTime() - this.sinceStart.getTime() + oldTime;
	}

	private verifyTime(data: Object) {
		let rightNow = new Date();

		if (!data['time']) {
			data['time'] = {};
		}

		if (!data['time'][rightNow.getFullYear()]) {
			data['time'][rightNow.getFullYear()] = {};
		}

		if (!data['time'][rightNow.getFullYear()][rightNow.getMonth() + 1]) {
			data['time'][rightNow.getFullYear()][rightNow.getMonth() + 1] = {};
		}

		if (!data['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]) {
			data['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()] = {
				total: this.time,
			};
		}

		return data;
	}

	private loadTime() {
		let alreadyStored = this.storageUtils.getLocalStoredTime();

		if (alreadyStored['time']) {
			return alreadyStored;
		} else {
			return {};
		}
	}
}
