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
