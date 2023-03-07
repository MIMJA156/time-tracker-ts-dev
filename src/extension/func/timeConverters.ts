import { min } from 'moment/moment';

export function days(value: number) {
	return value * 24 * 60 * 60 * 1000;
}

export function hours(value: number) {
	return value * 60 * 60 * 1000;
}

export function minutes(value: number) {
	return value * 60 * 1000;
}

export function seconds(value: number) {
	return value * 1000;
}

//Millisecond Related
export function MillisecondsToDays(value: number) {
	return value / 1000 / 60 / 60 / 24;
}

export function MillisecondsToHours(value: number) {
	return value / 1000 / 60 / 60;
}
export function MillisecondsToMinutes(value: number) {
	return value / 1000 / 60;
}
export function MillisecondsToSeconds(value: number) {
	return value / 1000;
}

export function DaysToMilliseconds(value: number) {
	return value * 1000 * 60 * 60 * 24;
}

export function HoursToMilliseconds(value: number) {
	return value * 1000 * 60 * 60;
}

export function MinutesToMilliseconds(value: number) {
	return value * 1000 * 60;
}

export function SecondsToMilliseconds(value: number) {
	return value * 1000 * 60;
}

// seconds to time values
export function SecondsToHoursMinutesSeconds(value: number) {
	let hours = Math.floor(value / (60 * 60));
	let minutes = Math.floor((value - hours * 60 * 60) / 60);
	let seconds = Math.floor(((value - (minutes * 60 + hours * 60 * 60)) / 60) * 60);

	return {
		hours,
		minutes,
		seconds,
	};
}
