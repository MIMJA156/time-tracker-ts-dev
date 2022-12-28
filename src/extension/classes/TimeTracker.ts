import { StorageUtils } from './StorageUtils';

export class TimeTracker {
	private storageUtilities: StorageUtils;
	private sampleRate: number;
	private timeObject: object;
	private sessionStart: number = new Date().getTime();

	private loop: string | number | NodeJS.Timer | undefined;

	constructor({ sampleRate, storageUtils }: { sampleRate: number; storageUtils: StorageUtils }) {
		this.storageUtilities = storageUtils;
		this.sampleRate = sampleRate;

		this.timeObject = this.sanitizeTimeObject(this.storageUtilities.getLocalStoredTime());
	}

	public start() {
		this.loop = setInterval(() => {
			let current = new Date();
			this.timeObject['time'][current.getFullYear()][current.getMonth() + 1][current.getDate()] = this.calculateTimeSpent(this.sessionStart, this.timeObject);
		}, this.sampleRate);
	}

	public stop() {
		clearInterval(this.loop);
	}

	public save() {
		let current = new Date();
		this.timeObject['time'][current.getFullYear()][current.getMonth() + 1][current.getDate()] = this.calculateTimeSpent(this.sessionStart, this.timeObject);
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

	private calculateTimeSpent(sessionStart: number, timeObject: object) {
		let current = new Date();
		let result = current.getTime() - sessionStart + timeObject['time'][current.getFullYear()][current.getMonth() + 1][current.getDate()];
		return result;
	}
}
