import { StorageUtils } from './StorageUtils';

export class TimeTracker {
	private time: number = 0;
	private sinceStart: Date = new Date();
	private saveInterval: number;
	private storageUtils: StorageUtils;

	private savedValues: Object;

	constructor({ saveInterval, idleTimeout, storageUtils }) {
		this.saveInterval = saveInterval;
		this.storageUtils = storageUtils;

		this.loadTime();
	}

	start() {
		setInterval(() => {
			let rightNow = new Date();

			console.log(rightNow.getDate(), this.sinceStart.getDate());

			if (rightNow.getDate() !== this.sinceStart.getDate() || rightNow.getMonth() !== this.sinceStart.getMonth()) {
				this.sinceStart = rightNow;
			}

			let oldTime = this.savedValues['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]['total'] !== undefined ? this.savedValues['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()]['total'] : 0;

			this.time = rightNow.getTime() - this.sinceStart.getTime() + oldTime;
			this.saveTime();
		}, this.saveInterval);
	}

	saveTime() {
		let alreadyStored = this.storageUtils.getLocalStoredTime();
		let rightNow = new Date();

		if (!alreadyStored['time']) {
			alreadyStored['time'] = {};
		}

		if (!alreadyStored['time'][rightNow.getFullYear()]) {
			alreadyStored['time'][rightNow.getFullYear()] = {};
		}

		if (!alreadyStored['time'][rightNow.getFullYear()][rightNow.getMonth() + 1]) {
			alreadyStored['time'][rightNow.getFullYear()][rightNow.getMonth() + 1] = {};
		}

		alreadyStored['time'][rightNow.getFullYear()][rightNow.getMonth() + 1][rightNow.getDate()] = {
			total: this.time,
		};

		this.storageUtils.setLocalStoredTime(alreadyStored);
	}

	loadTime() {
		let alreadyStored = this.storageUtils.getLocalStoredTime();

		if (alreadyStored['time']) {
			this.savedValues = alreadyStored;
		}
	}
}
