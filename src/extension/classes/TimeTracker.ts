import { StorageUtils } from './StorageUtils';

export class TimeTracker {
	private counter: NodeJS.Timer;
	private time: number = 0;
	private sinceStart: Date = new Date();
	private badgeUpdateRate: number;
	private savedValues: Object;
	private storageUtils: StorageUtils;

	constructor({ badgeUpdateRate, storageUtils }) {
		this.badgeUpdateRate = badgeUpdateRate;
		this.storageUtils = storageUtils;

		this.savedValues = this.verifyTime(this.loadTime());
	}

	start() {
		this.counter = setInterval(() => {
			this.time = this.calculateTime();
			console.log(this.time);
		}, this.badgeUpdateRate);
	}

	stop() {
		this.saveTime();
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

		data['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()] = {
			total: this.time,
		};

		return data;
	}

	private saveTime() {
		this.storageUtils.setLocalStoredTime(this.savedValues);
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
